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
        // Phase 1 Contract: SEO must be 100
        'categories:seo': ['error', { minScore: 1.0 }],

        // Performance requirements (enforced)
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],

        // Specific metrics from roadmap
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Phase 1 Contract: JS bundle ≤ 250KB
        'resource-summary:script:size': ['error', { maxNumericValue: 250000 }],

        // No render-blocking resources
        'render-blocking-resources': ['error', { maxLength: 0 }],

        // Image optimization
        'uses-responsive-images': 'error',
        'uses-optimized-images': 'error',
        'modern-image-formats': 'error',
        'image-aspect-ratio': 'error',

        // SEO specific checks (all enforced)
        'document-title': 'error',
        'meta-description': 'error',
        'link-text': 'error',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'error',
        hreflang: 'error',
        canonical: 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
