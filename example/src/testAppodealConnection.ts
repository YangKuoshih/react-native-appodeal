/**
 * Automated Appodeal SDK Connection Test
 *
 * This script tests the Appodeal SDK connection and ad loading
 * using your configured app key and bundle ID.
 *
 * Run this test to verify:
 * 1. SDK can connect to Appodeal servers
 * 2. App key is valid
 * 3. Ads can be loaded successfully
 * 4. Backend communication is working
 *
 * IMPORTANT: This test only verifies ad LOADING. Impressions are counted
 * when ads are actually SHOWN to users (when "Rewarded shown" event fires).
 * To get impressions in your dashboard, you must SHOW ads, not just load them.
 */

import Appodeal, {
  AppodealAdType,
  AppodealLogLevel,
  AppodealSdkEvents,
  AppodealRewardedEvents,
} from 'react-native-appodeal';
import { getAppodealKey } from './config/appodeal.config';

// Get configuration from environment (or demo values)
const APPODEAL_APP_KEY = getAppodealKey();
const BUNDLE_ID = 'com.example.appodeal'; // Display only - actual bundle ID is set in native config
const ADMOB_APP_ID = 'ca-app-pub-xxxx~yyyy'; // Display only - actual ID is set in native config
const REWARDED_AD_UNIT = 'configured-in-appodeal-dashboard'; // Display only

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  message: string;
  timestamp: number;
}

class AppodealConnectionTest {
  private results: TestResult[] = [];
  private initializationComplete = false;
  private adLoaded = false;
  private adLoadTimeout: NodeJS.Timeout | null = null;

  private addResult(
    test: string,
    status: 'PASS' | 'FAIL' | 'PENDING',
    message: string
  ) {
    this.results.push({
      test,
      status,
      message,
      timestamp: Date.now(),
    });
    console.log(`[TEST] ${status}: ${test} - ${message}`);
  }

  async runTests(): Promise<void> {
    console.log('========================================');
    console.log('Appodeal SDK Connection Test');
    console.log('========================================');
    console.log(`App Key: ${APPODEAL_APP_KEY.substring(0, 20)}...`);
    console.log(`Bundle ID: ${BUNDLE_ID}`);
    console.log(`AdMob App ID: ${ADMOB_APP_ID}`);
    console.log('========================================\n');

    // Test 1: Check SDK version
    this.testSDKVersion();

    // Test 2: Initialize SDK
    await this.testSDKInitialization();

    // Test 3: Test ad loading
    await this.testAdLoading();

    // Test 4: Print results
    this.printResults();
  }

  private testSDKVersion() {
    try {
      const pluginVersion = Appodeal.getVersion();
      const sdkVersion = Appodeal.getPlatformSdkVersion();

      this.addResult(
        'SDK Version Check',
        'PASS',
        `Plugin: ${pluginVersion}, SDK: ${sdkVersion}`
      );
    } catch (error: any) {
      this.addResult('SDK Version Check', 'FAIL', `Error: ${error.message}`);
    }
  }

  private async testSDKInitialization(): Promise<void> {
    return new Promise((resolve) => {
      this.addResult(
        'SDK Initialization',
        'PENDING',
        'Initializing Appodeal SDK...'
      );

      // Set up event listener
      const onInitialized = () => {
        this.initializationComplete = true;
        this.addResult(
          'SDK Initialization',
          'PASS',
          'SDK successfully connected to Appodeal servers'
        );
        Appodeal.removeEventListener(
          AppodealSdkEvents.INITIALIZED,
          onInitialized
        );
        resolve();
      };

      Appodeal.addEventListener(AppodealSdkEvents.INITIALIZED, onInitialized);

      // Configure SDK
      Appodeal.setTesting(false);
      Appodeal.setLogLevel(AppodealLogLevel.DEBUG);

      // Initialize
      Appodeal.initialize(APPODEAL_APP_KEY, AppodealAdType.REWARDED_VIDEO);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!this.initializationComplete) {
          this.addResult(
            'SDK Initialization',
            'FAIL',
            'Timeout: SDK did not initialize within 30 seconds'
          );
          Appodeal.removeEventListener(
            AppodealSdkEvents.INITIALIZED,
            onInitialized
          );
          resolve();
        }
      }, 30000);
    });
  }

  private async testAdLoading(): Promise<void> {
    if (!this.initializationComplete) {
      this.addResult(
        'Ad Loading',
        'FAIL',
        'Cannot test ad loading: SDK not initialized'
      );
      return;
    }

    return new Promise((resolve) => {
      this.addResult(
        'Ad Loading',
        'PENDING',
        'Attempting to load rewarded ad...'
      );

      // Set up event listeners
      const onLoaded = (event: any) => {
        this.adLoaded = true;
        this.addResult(
          'Ad Loading',
          'PASS',
          `Ad loaded successfully. Details: ${JSON.stringify(event)}`
        );
        cleanup();
        resolve();
      };

      const onFailedToLoad = () => {
        this.addResult(
          'Ad Loading',
          'FAIL',
          'Failed to load ad. Check dashboard configuration.'
        );
        cleanup();
        resolve();
      };

      Appodeal.addEventListener(AppodealRewardedEvents.LOADED, onLoaded);
      Appodeal.addEventListener(
        AppodealRewardedEvents.FAILED_TO_LOAD,
        onFailedToLoad
      );

      // Attempt to load ad
      Appodeal.cache(AppodealAdType.REWARDED_VIDEO);

      // Timeout after 30 seconds
      this.adLoadTimeout = setTimeout(() => {
        if (!this.adLoaded) {
          this.addResult(
            'Ad Loading',
            'FAIL',
            'Timeout: Ad did not load within 30 seconds'
          );
          cleanup();
          resolve();
        }
      }, 30000);

      const cleanup = () => {
        if (this.adLoadTimeout) {
          clearTimeout(this.adLoadTimeout);
        }
        Appodeal.removeEventListener(AppodealRewardedEvents.LOADED, onLoaded);
        Appodeal.removeEventListener(
          AppodealRewardedEvents.FAILED_TO_LOAD,
          onFailedToLoad
        );
      };
    });
  }

  private printResults() {
    console.log('\n========================================');
    console.log('Test Results Summary');
    console.log('========================================');

    const passed = this.results.filter((r) => r.status === 'PASS').length;
    const failed = this.results.filter((r) => r.status === 'FAIL').length;
    const pending = this.results.filter((r) => r.status === 'PENDING').length;

    this.results.forEach((result) => {
      const icon =
        result.status === 'PASS'
          ? '✅'
          : result.status === 'FAIL'
            ? '❌'
            : '⏳';
      console.log(`${icon} ${result.test}: ${result.message}`);
    });

    console.log('\n========================================');
    console.log(`Total: ${this.results.length} tests`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏳ Pending: ${pending}`);
    console.log('========================================\n');

    // Connection status
    if (this.initializationComplete && this.adLoaded) {
      console.log('🎉 SUCCESS: SDK connection and ad loading verified!');
      console.log('✅ Your Appodeal setup is working correctly.');
      console.log('✅ Backend communication is successful.');
      console.log(
        '\n📌 IMPORTANT: Impressions are counted when ads are SHOWN, not loaded!'
      );
      console.log('   To get impressions in your dashboard:');
      console.log('   1. Go to "Rewarded Video Ads" screen');
      console.log('   2. Tap "Show Rewarded Video" (not just load)');
      console.log('   3. Wait for "Rewarded shown" event in console');
      console.log('   4. Wait 15-30 minutes for dashboard to sync');
      console.log('   5. Check Appodeal dashboard for impressions');
    } else if (this.initializationComplete && !this.adLoaded) {
      console.log('⚠️  PARTIAL: SDK connected but ads not loading.');
      console.log('   Check your Appodeal dashboard configuration:');
      console.log(`   - App Key: ${APPODEAL_APP_KEY}`);
      console.log(`   - Bundle ID: ${BUNDLE_ID}`);
      console.log(`   - Rewarded Video format enabled`);
      console.log(`   - AdMob network connected`);
      console.log(`   - Ad unit linked: ${REWARDED_AD_UNIT}`);
    } else {
      console.log('❌ FAILED: SDK could not connect to Appodeal servers.');
      console.log('   Verify your app key is correct in the dashboard.');
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }
}

// Export for use in React Native
export default AppodealConnectionTest;

// Standalone test function
export async function runAppodealTest() {
  const test = new AppodealConnectionTest();
  await test.runTests();
  return test.getResults();
}
