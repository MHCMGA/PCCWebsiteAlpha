module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/about',
        'http://localhost:4173/contact',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --headless=new',
      },
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'uses-http2': 'off',
        'uses-text-compression': 'off',
        'csp-xss': 'off',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './reports/lighthouse',
    },
  },
};
