import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

// Email validation schema
const NewsletterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

// Rate limiting setup (if Redis is available)
let rateLimiter: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Allow 5 requests per IP per hour
  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
  });
}

export const POST = async (request: Request) => {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    // Apply rate limiting if available
    if (rateLimiter) {
      const { success, limit, reset, remaining } = await rateLimiter.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': new Date(reset).toISOString(),
            },
          }
        );
      }
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = NewsletterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid email format',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Check for CSRF token in production
    if (process.env.NODE_ENV === 'production') {
      const csrfToken = request.headers.get('x-csrf-token');

      // In a real implementation, validate the CSRF token against a stored value
      // For now, we'll just check it exists
      if (!csrfToken) {
        return NextResponse.json(
          { error: 'Missing CSRF token' },
          { status: 403 }
        );
      }
    }

    // Check if Resend is properly configured
    if (
      !process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY === 're_placeholder'
    ) {
      console.error('Newsletter signup: Resend API key not configured');

      // In development, return success to allow testing
      if (process.env.NODE_ENV === 'development') {
        console.warn('Newsletter signup (dev mode):', email);
        return NextResponse.json({
          success: true,
          message: 'Email saved (development mode)',
        });
      }

      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 503 }
      );
    }

    // Check if audience ID is configured
    if (!process.env.RESEND_AUDIENCE_ID) {
      console.error('Newsletter signup: Resend audience ID not configured');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 503 }
      );
    }

    // Create contact in Resend (with await!)
    try {
      await resend.contacts.create({
        email,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter',
      });
    } catch (resendError: unknown) {
      console.error('Resend API error:', resendError);

      // Check for duplicate email error
      if (
        resendError instanceof Error &&
        resendError.message?.includes('already exists')
      ) {
        return NextResponse.json({
          success: true,
          message: 'Email already subscribed',
        });
      }

      throw resendError;
    }
  } catch (error: unknown) {
    console.error('Newsletter signup error:', error);

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
};
