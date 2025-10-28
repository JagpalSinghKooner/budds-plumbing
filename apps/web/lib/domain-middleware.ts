/**
 * Multi-Domain Support - Domain Middleware
 *
 * This middleware handles:
 * - Domain extraction and validation
 * - Redirects for invalid domains
 * - Security headers
 * - Domain-specific caching strategies
 * - Request context enrichment
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractDomain, getDomainConfig, getSiteUrl } from './domain-mapping';
import type {
  DomainConfig,
  DomainValidationResult,
  DomainContext,
} from './domain-types';

export type { DomainValidationResult, DomainContext } from './domain-types';

/**
 * Validate domain from request
 * Returns validation result with config and redirect information
 */
export function validateDomain(request: NextRequest): DomainValidationResult {
  const domain = extractDomain(request.headers);
  const config = getDomainConfig(domain);

  // Check if domain is valid and enabled
  if (!config) {
    return {
      isValid: false,
      config: null,
      domain,
      shouldRedirect: true,
      redirectUrl:
        process.env.NEXT_PUBLIC_SITE_URL || 'https://buddsplumbing.com',
    };
  }

  // Check for www redirect (optional - configure based on preference)
  if (config.domain.startsWith('www.') && !domain.startsWith('www.')) {
    const baseUrl = getSiteUrl(config);
    return {
      isValid: true,
      config,
      domain,
      shouldRedirect: true,
      redirectUrl: `${baseUrl}${request.nextUrl.pathname}${request.nextUrl.search}`,
    };
  }

  return {
    isValid: true,
    config,
    domain,
    shouldRedirect: false,
  };
}

/**
 * Apply security headers to response
 * Adds HSTS, CSP, and other security headers
 */
export function applySecurityHeaders(
  response: NextResponse,
  config: DomainConfig
): NextResponse {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

  // HSTS (HTTP Strict Transport Security)
  if (isProduction && !config.domain.includes('localhost')) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Content Security Policy
  // Note: Adjust based on your needs (Sanity, analytics, etc.)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.sanity.io https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.sanity.io https://*.sanity.studio https://www.google-analytics.com",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ];

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  // Additional security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

/**
 * Apply caching headers based on domain and path
 * Different caching strategies for different content types
 */
export function applyCachingHeaders(
  response: NextResponse,
  request: NextRequest,
  config: DomainConfig
): NextResponse {
  const { pathname } = request.nextUrl;

  // Static assets - long cache
  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|eot)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
    return response;
  }

  // JavaScript and CSS - cache with revalidation
  if (pathname.match(/\.(js|css)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );
    return response;
  }

  // API routes - no cache by default
  if (pathname.startsWith('/api')) {
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate'
    );
    return response;
  }

  // Pages - cache with revalidation
  response.headers.set(
    'Cache-Control',
    'public, max-age=60, stale-while-revalidate=3600'
  );

  return response;
}

/**
 * Add domain context headers to request
 * These headers can be read by API routes and page components
 */
export function addDomainContextHeaders(
  response: NextResponse,
  config: DomainConfig
): NextResponse {
  // Add custom headers for domain context
  response.headers.set('x-domain', config.domain);
  response.headers.set('x-client-id', config.clientId);
  response.headers.set('x-dataset', config.dataset);

  if (config.projectId) {
    response.headers.set('x-project-id', config.projectId);
  }

  return response;
}

/**
 * Main domain middleware function
 * Use this in your Next.js middleware.ts file
 */
export function domainMiddleware(request: NextRequest): NextResponse {
  // Validate domain
  const validation = validateDomain(request);

  // Handle invalid domains or required redirects
  if (validation.shouldRedirect && validation.redirectUrl) {
    return NextResponse.redirect(new URL(validation.redirectUrl), {
      status: 301, // Permanent redirect
    });
  }

  if (!validation.isValid || !validation.config) {
    // Return 404 for invalid domains
    return new NextResponse('Domain not found', { status: 404 });
  }

  // Create response
  let response = NextResponse.next();

  // Apply security headers
  response = applySecurityHeaders(response, validation.config);

  // Apply caching headers
  response = applyCachingHeaders(response, request, validation.config);

  // Add domain context headers
  response = addDomainContextHeaders(response, validation.config);

  return response;
}

/**
 * Matcher configuration for Next.js middleware
 * Excludes static files and Next.js internals
 */
export const domainMiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files (public/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};

/**
 * Get domain config from response headers
 * Useful in API routes and server components
 */
export function getDomainConfigFromResponse(headers: Headers): DomainContext {
  return {
    domain: headers.get('x-domain') || 'localhost:3000',
    clientId: headers.get('x-client-id') || 'budds-dev',
    dataset: headers.get('x-dataset') || 'development',
    projectId: headers.get('x-project-id') || undefined,
  };
}
