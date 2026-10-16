import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// Browser smoke tests run against a locally-built, root-base site served by
// `astro preview`. CI builds at base '' for the test pass, then rebuilds with
// BASE_PATH=/dhanpedia for the Pages artifact.
//
// Windows: the desktop app's own Node (v22) may shadow the system Node (v24)
// on PATH. Astro 7 requires >=22.22, so when C:\Program Files\nodejs exists
// we prepend it to the webServer's PATH so `npm run preview` uses the real
// system Node. On Linux/macOS/CI the inherited PATH is fine.
const nodeDir = 'C:\\Program Files\\nodejs';
const serverEnv =
  process.platform === 'win32' && existsSync(nodeDir)
    ? { ...process.env, PATH: `${nodeDir};${process.env.PATH ?? ''}` }
    : undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: false,
  },
  webServer: {
    command: 'npm run preview -- --port 4321 --strictPort',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    ...(serverEnv ? { env: serverEnv } : {}),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // Run the iPhone viewport on chromium so only one browser engine is needed.
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
});
