import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Appodeal, {
  AppodealAdType,
  AppodealRewardedEvents,
  AppodealSdkEvents,
} from 'react-native-appodeal';
import type { NavigationProps } from '../App';
import { commonStyles as styles } from '../styles/common';

interface RewardedVideoScreenProps {
  navigation: NavigationProps;
}

export default function RewardedVideoScreen({
  navigation,
}: RewardedVideoScreenProps) {
  const loadRewardedVideo = () => {
    console.log(
      '🔄 [RewardedVideo] Load button pressed - attempting to load ad...'
    );
    const canShow = Appodeal.canShow(AppodealAdType.REWARDED_VIDEO);
    console.log('📊 [RewardedVideo] Can show before load:', canShow);
    Appodeal.cache(AppodealAdType.REWARDED_VIDEO);
    console.log(
      '✅ [RewardedVideo] cache() called - waiting for LOADED or FAILED_TO_LOAD event...'
    );
  };

  const showRewardedVideo = () => {
    console.log(
      '🎬 [RewardedVideo] Show button pressed - attempting to show ad...'
    );

    // OFFICIAL APPODEAL REQUIREMENT: Wait 15 seconds after initialization
    // Source: https://faq.appodeal.com/en/articles/2658372-problem-with-displaying-ads
    const initializationTime = (global as any).appodealInitializationTime;
    if (initializationTime) {
      const timeSinceInit = Date.now() - initializationTime;
      const requiredWait = 15000; // 15 seconds in milliseconds

      if (timeSinceInit < requiredWait) {
        const remainingSeconds = Math.ceil(
          (requiredWait - timeSinceInit) / 1000
        );
        console.log(
          '⏳ [RewardedVideo] OFFICIAL REQUIREMENT: Wait 15 seconds after initialization'
        );
        console.log(
          `   ⚠️  Only ${Math.floor(timeSinceInit / 1000)} seconds have passed since initialization`
        );
        console.log(
          `   ⏳ Please wait ${remainingSeconds} more seconds before showing ads`
        );
        console.log('   📖 Source: Appodeal official documentation');
        return;
      } else {
        console.log(
          `✅ [RewardedVideo] ${Math.floor(timeSinceInit / 1000)} seconds since initialization - requirement met`
        );
      }
    } else {
      console.log(
        '⚠️  [RewardedVideo] Initialization time not recorded. Proceeding anyway...'
      );
    }

    // Check multiple conditions
    const isLoaded = Appodeal.isLoaded(AppodealAdType.REWARDED_VIDEO);
    const canShow = Appodeal.canShow(AppodealAdType.REWARDED_VIDEO);

    console.log('📊 [RewardedVideo] Status check:');
    console.log('   - isLoaded:', isLoaded);
    console.log('   - canShow:', canShow);

    if (!isLoaded) {
      console.log('❌ [RewardedVideo] Ad is NOT loaded. Please load ad first.');
      return;
    }

    if (!canShow) {
      console.log(
        '❌ [RewardedVideo] Ad cannot be shown. Check SDK initialization and ad readiness.'
      );
      console.log('   💡 Possible causes:');
      console.log('      - Impression Interval setting too high in dashboard');
      console.log('      - Impressions per Session limit reached');
      console.log('      - Ad expired (reload needed)');
      return;
    }

    console.log('✅ [RewardedVideo] All checks passed. Calling show()...');
    try {
      Appodeal.show(AppodealAdType.REWARDED_VIDEO);
      console.log('✅ [RewardedVideo] show() called successfully.');
      console.log('   ⏳ Waiting for SHOWN or FAILED_TO_SHOW event...');
      console.log(
        '   📊 If SHOWN fires, Display Rate should increase in dashboard.'
      );
    } catch (error: any) {
      console.log('❌ [RewardedVideo] Error calling show():', error);
    }
  };

  const handlePredictedEcpm = () => {
    const value = Appodeal.predictedEcpm(AppodealAdType.REWARDED_VIDEO);
    console.log('Predicted eCPM (Rewarded):', value);
  };

  const handleCanShow = () => {
    const value = Appodeal.canShow(AppodealAdType.REWARDED_VIDEO);
    console.log('Can Show Rewarded Video:', value);
  };

  React.useEffect(() => {
    console.log('🔧 [RewardedVideo] Setting up event listeners...');

    // Subscribe to rewarded video events
    const onLoaded = (event: any) => {
      console.log('✅ [RewardedVideo] LOADED event received!', event);
      console.log('   Ad is ready to show. Use "Show Rewarded Video" button.');
    };
    const onFailedToLoad = () => {
      console.log('❌ [RewardedVideo] FAILED_TO_LOAD event received');
      console.log(
        '   Check: 1) SDK initialized? 2) Network connection? 3) Dashboard config?'
      );
    };
    const onExpired = () => {
      console.log(
        '⏰ [RewardedVideo] EXPIRED event received - ad expired, need to reload'
      );
    };
    const onShown = () => {
      console.log(
        '🎉 [RewardedVideo] SHOWN event received - Ad is displaying!'
      );
      console.log('   ✅ This should increase Display Rate in dashboard.');
      console.log('   📊 Display Rate should go from 0% to >0% after this.');
      console.log(
        '   ⚠️  Note: Server confirmation comes via AD_REVENUE event.'
      );
      console.log(
        '   📊 Check dashboard in 15-30 minutes to verify server recorded it.'
      );
    };
    const onFailedToShow = () => {
      console.log(
        '❌ [RewardedVideo] FAILED_TO_SHOW event received - CRITICAL!'
      );
      console.log('   ⚠️  This explains why Display Rate is 0% in dashboard!');
      console.log('   Possible causes:');
      console.log('   1. Ad expired (reload needed)');
      console.log('   2. SDK not fully initialized');
      console.log('   3. View controller issue (iOS)');
      console.log('   4. Ad network error');
      console.log('   💡 Try: Load ad again, wait 15 seconds, then show.');
    };
    const onClosed = (event: any) => {
      console.log('🚪 [RewardedVideo] CLOSED event received', event);
    };
    const onReward = (event: any) => {
      console.log(
        '🎁 [RewardedVideo] REWARD event received - user earned reward!',
        event
      );
    };
    const onClicked = () => {
      console.log(
        '👆 [RewardedVideo] CLICKED event received - user clicked the ad'
      );
    };

    Appodeal.addEventListener(AppodealRewardedEvents.LOADED, onLoaded);
    Appodeal.addEventListener(
      AppodealRewardedEvents.FAILED_TO_LOAD,
      onFailedToLoad
    );
    Appodeal.addEventListener(AppodealRewardedEvents.EXPIRED, onExpired);
    Appodeal.addEventListener(AppodealRewardedEvents.SHOWN, onShown);
    Appodeal.addEventListener(
      AppodealRewardedEvents.FAILED_TO_SHOW,
      onFailedToShow
    );
    Appodeal.addEventListener(AppodealRewardedEvents.CLOSED, onClosed);
    Appodeal.addEventListener(AppodealRewardedEvents.REWARD, onReward);
    Appodeal.addEventListener(AppodealRewardedEvents.CLICKED, onClicked);

    // Listen for revenue event - this confirms server recorded the impression
    const onRevenue = (revenue: any) => {
      console.log(
        '💰 [RewardedVideo] AD_REVENUE event received - SERVER CONFIRMED IMPRESSION!'
      );
      console.log('   ✅ This is proof the server recorded the impression.');
      console.log('   Revenue data:', {
        network: revenue.networkName,
        adUnit: revenue.adUnitName,
        placement: revenue.placement,
        revenue: revenue.revenue,
        currency: revenue.currency,
        precision: revenue.revenuePrecision,
      });
      console.log(
        '   📊 This should appear in your dashboard within 15-30 minutes.'
      );
    };
    Appodeal.addEventListener(AppodealSdkEvents.AD_REVENUE, onRevenue);

    console.log('✅ [RewardedVideo] Event listeners registered');
    console.log(
      '💡 [RewardedVideo] Make sure SDK is initialized (use "Initialize Appodeal" on home screen)'
    );

    return () => {
      Appodeal.removeEventListener(AppodealRewardedEvents.LOADED, onLoaded);
      Appodeal.removeEventListener(
        AppodealRewardedEvents.FAILED_TO_LOAD,
        onFailedToLoad
      );
      Appodeal.removeEventListener(AppodealRewardedEvents.EXPIRED, onExpired);
      Appodeal.removeEventListener(AppodealRewardedEvents.SHOWN, onShown);
      Appodeal.removeEventListener(
        AppodealRewardedEvents.FAILED_TO_SHOW,
        onFailedToShow
      );
      Appodeal.removeEventListener(AppodealRewardedEvents.CLOSED, onClosed);
      Appodeal.removeEventListener(AppodealRewardedEvents.REWARD, onReward);
      Appodeal.removeEventListener(AppodealRewardedEvents.CLICKED, onClicked);
      Appodeal.removeEventListener(AppodealSdkEvents.AD_REVENUE, onRevenue);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={loadRewardedVideo}>
          <Text style={styles.buttonText}>Load Rewarded Video</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={showRewardedVideo}>
          <Text style={styles.buttonText}>Show Rewarded Video</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handlePredictedEcpm}>
          <Text style={styles.buttonText}>Get Predicted eCPM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCanShow}>
          <Text style={styles.buttonText}>Can Show Rewarded Video?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
