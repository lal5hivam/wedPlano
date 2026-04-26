/**
 * Jest global setup for Wedplano backend tests.
 *
 * Sets environment variables required by the app before any test module loads.
 * This file is referenced in jest.config.js as `setupFiles`.
 */

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'wedplano-test-secret-key-32chars!!';
process.env.JWT_EXPIRES_IN = '1h';
process.env.FIREBASE_PROJECT_ID = 'wedplano-test';
process.env.PORT = '5001';

// Suppress console output during tests unless TEST_VERBOSE=true
if (!process.env.TEST_VERBOSE) {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Keep error visible so test failures are clear
    error: console.error,
  };
}
