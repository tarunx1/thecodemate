import { defineConfig, devices } from '@playwright/test';

/** Only the disposable stack launcher may run browser tests. */
if (process.env.E2E_DISPOSABLE !== '1' || process.env.E2E_BASE_URL !== 'http://127.0.0.1:3011') {
  throw new Error('Run npm run test:e2e to create an isolated database and local stack.');
}
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: process.env.E2E_BASE_URL, trace: 'off' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
