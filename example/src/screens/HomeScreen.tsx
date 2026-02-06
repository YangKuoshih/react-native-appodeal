import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Appodeal, {
  AppodealAdType,
  AppodealLogLevel,
  AppodealSdkEvents,
} from 'react-native-appodeal';
import type { BaseScreenProps } from '../App';
import { commonStyles as styles } from '../styles/common';
import { runAppodealTest } from '../testAppodealConnection';
import { getAppodealKey } from '../config/appodeal.config';

// Get Appodeal key from environment config (falls back to demo key)
const exampleAppodealKey = getAppodealKey();

// Store initialization time globally so RewardedVideoScreen can access it
let appodealInitializationTime: number | null = null;

interface HomeScreenProps extends BaseScreenProps {}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const initializeAppodeal = () => {
    Appodeal.setTesting(true); // Enable test mode for testing
    Appodeal.setLogLevel(AppodealLogLevel.VERBOSE); // Use VERBOSE for maximum logging

    // Disable auto-cache for all ad types (manual control via buttons)
    Appodeal.setAutoCache(AppodealAdType.INTERSTITIAL, false);
    Appodeal.setAutoCache(AppodealAdType.REWARDED_VIDEO, false);
    Appodeal.setAutoCache(AppodealAdType.BANNER, false); // ← FIXED: Disable to prevent conflict with manual cache button
    console.log('🎯 Banner auto-cache DISABLED (manual control enabled)');

    Appodeal.addEventListener(AppodealSdkEvents.INITIALIZED, () => {
      appodealInitializationTime = Date.now();
      // Store globally so RewardedVideoScreen can access it
      (global as any).appodealInitializationTime = appodealInitializationTime;
      console.log('✅ Appodeal initialized');
      console.log(
        '⏳ OFFICIAL REQUIREMENT: Wait 15 seconds before showing ads'
      );
      console.log(
        '   According to Appodeal docs: "Call show() at least 15 seconds after initialization"'
      );
      console.log(
        '   Source: https://faq.appodeal.com/en/articles/2658372-problem-with-displaying-ads'
      );
      console.log(
        '   Initialization time recorded:',
        new Date(appodealInitializationTime).toLocaleTimeString()
      );

      // Check banner availability after initialization
      setTimeout(() => {
        const canShowBanner = Appodeal.canShow(AppodealAdType.BANNER);
        console.log(
          '🎯 Banner availability check (immediately after init):',
          canShowBanner
        );
      }, 1000);
    });

    console.log('🚀 Starting Appodeal initialization...');
    console.log('📱 App Key:', exampleAppodealKey);
    console.log('🎯 Ad Types: REWARDED_VIDEO | BANNER | INTERSTITIAL');

    Appodeal.initialize(
      exampleAppodealKey,
      AppodealAdType.REWARDED_VIDEO |
        AppodealAdType.BANNER |
        AppodealAdType.INTERSTITIAL
    );

    console.log('✅ Appodeal.initialize() called');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pluginVersion}>
          Plugin version: {Appodeal.getVersion()}
        </Text>
        <Text style={styles.sdkVersion}>
          SDK version: {Appodeal.getPlatformSdkVersion()}{' '}
        </Text>

        <TouchableOpacity style={styles.button} onPress={initializeAppodeal}>
          <Text style={styles.buttonText}>Initialize Appodeal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#28a745' }]}
          onPress={async () => {
            console.log('Starting automated Appodeal connection test...');
            await runAppodealTest();
          }}
        >
          <Text style={styles.buttonText}>🧪 Run Connection Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Interstitial')}
        >
          <Text style={styles.buttonText}>Interstitial Ads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RewardedVideo')}
        >
          <Text style={styles.buttonText}>Rewarded Video Ads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Banner')}
        >
          <Text style={styles.buttonText}>Banner Ads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BannerView')}
        >
          <Text style={styles.buttonText}>Banner View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MrecView')}
        >
          <Text style={styles.buttonText}>MREC View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('ConsentManager', {
              appKey: exampleAppodealKey,
            })
          }
        >
          <Text style={styles.buttonText}>Consent Manager</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
