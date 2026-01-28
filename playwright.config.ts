import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
    toHaveScreenshot: {
      maxDiffPixelRatio: Number(process.env.VISUAL_DIFF_RATIO || 0.02),
    },
  },
  reporter: [['html', { open: 'always' }], ['list']],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    locale: 'en-GB',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
  snapshotPathTemplate: '{testDir}/.snapshots/{testFilePath}/{arg}{ext}',
});
