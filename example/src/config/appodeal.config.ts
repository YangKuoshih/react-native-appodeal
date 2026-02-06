/**
 * Appodeal Configuration
 *
 * This file loads configuration from environment variables.
 * Copy .env.example to .env and fill in your actual values.
 *
 * IMPORTANT: Never commit your .env file to git!
 */

// Import environment variables from react-native-config
// If not installed, these will fall back to demo/test values
let Config: { [key: string]: string | undefined } = {};

try {
  // Try to import react-native-config
  Config = require('react-native-config').default || {};
} catch {
  // If react-native-config is not available, use empty config
  console.warn(
    '[Appodeal Config] react-native-config not found. Using demo values.'
  );
}

/**
 * Demo/test Appodeal key for development.
 * This is a PUBLIC demo key for testing the SDK integration.
 * Replace with your own key from the Appodeal dashboard for production.
 */
const DEMO_APPODEAL_KEY = 'dee74c5129f53fc629a44a690a02296694e3eef99f2d0a22';

/**
 * Get the Appodeal App Key
 * Uses environment variable if available, otherwise falls back to demo key
 */
export const getAppodealKey = (): string => {
  const envKey = Config.APPODEAL_APP_KEY;
  if (envKey && envKey !== 'your_appodeal_app_key_here') {
    return envKey;
  }
  console.log('[Appodeal Config] Using demo Appodeal key');
  return DEMO_APPODEAL_KEY;
};

/**
 * Get the AdMob App ID for iOS
 */
export const getAdMobAppIdIOS = (): string | undefined => {
  return Config.ADMOB_APP_ID_IOS;
};

/**
 * Get the AdMob App ID for Android
 */
export const getAdMobAppIdAndroid = (): string | undefined => {
  return Config.ADMOB_APP_ID_ANDROID;
};

/**
 * Check if custom (non-demo) configuration is being used
 */
export const isUsingCustomConfig = (): boolean => {
  const envKey = Config.APPODEAL_APP_KEY;
  return !!(envKey && envKey !== 'your_appodeal_app_key_here');
};

export default {
  getAppodealKey,
  getAdMobAppIdIOS,
  getAdMobAppIdAndroid,
  isUsingCustomConfig,
};
