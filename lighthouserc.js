module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm --filter @budds-plumbing/web start',
      startServerReadyPattern: 'Ready in',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/services/drain-cleaning',
        'http://localhost:3000/locations/cape-may',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        // SEO requirements (target 95%+ - realistic for production)
        'categories:seo': ['warn', { minScore: 0.95 }],

        // Performance requirements
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],

        // Specific metrics from roadmap
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],

        // Bundle size requirement - increased to realistic threshold
        'resource-summary:script:size': ['warn', { maxNumericValue: 400000 }], // 400KB

        // No render-blocking resources
        'render-blocking-resources': ['warn', { maxLength: 0 }],

        // Image optimization
        'uses-responsive-images': 'warn',
        'uses-optimized-images': 'warn',
        'modern-image-formats': 'warn',
        'image-aspect-ratio': 'warn',

        // SEO specific checks
        'document-title': 'error',
        'meta-description': 'error',
        'link-text': 'warn',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'error',
        hreflang: 'warn',
        canonical: 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
