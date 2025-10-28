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
        // SEO must score 100 as per roadmap requirements
        'categories:seo': ['error', { minScore: 1 }],

        // Performance requirements
        'categories:performance': ['warn', { minScore: 0.95 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],

        // Specific metrics from roadmap
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],

        // Bundle size requirement (approximation via resource size)
        'resource-summary:script:size': ['error', { maxNumericValue: 256000 }], // 250KB

        // No render-blocking resources
        'render-blocking-resources': ['warn', { maxLength: 0 }],

        // Image optimization
        'uses-responsive-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',
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
        'structured-data': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
