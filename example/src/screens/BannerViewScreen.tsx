import { useCallback, useState } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Appodeal, {
  AppodealAdType,
  AppodealBanner,
} from 'react-native-appodeal';
import type {
  BannerAdInfoEvent,
  BannerAdLoadedEvent,
  BannerAdLoadFailedEvent,
} from '../../../src/specs/AppodealBannerViewNativeComponent';
import type { NavigationProps } from '../App';
import { commonStyles as styles } from '../styles/common';

interface BannerViewScreenProps {
  navigation: NavigationProps;
}

export default function BannerViewScreen({
  navigation,
}: BannerViewScreenProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerStatus, setBannerStatus] = useState('Not loaded');

  const showBannerView = () => {
    setShowBanner(true);
    setBannerStatus('Loading banner view...');
  };

  const hideBannerView = () => {
    setShowBanner(false);
    setBannerStatus('Banner view hidden');
  };

  const handlePredictedEcpm = () => {
    const value = Appodeal.predictedEcpm(AppodealAdType.BANNER);
    console.log('Predicted eCPM (Banner):', value);
  };

  const handleCanShow = () => {
    const value = Appodeal.canShow(AppodealAdType.BANNER);
    console.log('Can Show Banner:', value);
    setBannerStatus(`Can show: ${value ? 'YES ✅' : 'NO ❌'}`);
  };

  const onAdLoadedEvent = useCallback(
    (event: NativeSyntheticEvent<BannerAdLoadedEvent>) => {
      console.log(
        'Banner ad loaded:',
        'height:',
        event.nativeEvent.height,
        'isPrecache:',
        event.nativeEvent.isPrecache
      );
      setBannerStatus(
        `✅ Banner loaded! Height: ${event.nativeEvent.height}px${
          event.nativeEvent.isPrecache ? ' (Precache)' : ''
        }`
      );
    },
    []
  );

  const onAdFailedToLoadEvent = useCallback(
    (event: NativeSyntheticEvent<BannerAdLoadFailedEvent>) => {
      console.log('Banner ad failed to load:', event.nativeEvent);
      setBannerStatus('❌ Banner failed to load');
    },
    []
  );

  const onAdClickedEvent = useCallback(
    (event: NativeSyntheticEvent<BannerAdInfoEvent>) => {
      console.log('Banner ad clicked:', event.nativeEvent);
      setBannerStatus('👆 Banner clicked!');
    },
    []
  );

  const onAdExpiredEvent = useCallback(
    (event: NativeSyntheticEvent<BannerAdInfoEvent>) => {
      console.log('Banner ad expired:', event.nativeEvent);
      setBannerStatus('⚠️ Banner expired');
    },
    []
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.screenContainer}>
        <View style={styles.content}>
          {/* Status Display */}
          <View style={bannerStyles.statusContainer}>
            <Text style={bannerStyles.statusLabel}>Banner View Status:</Text>
            <Text style={bannerStyles.statusText}>{bannerStatus}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={showBannerView}>
            <Text style={styles.buttonText}>Show Banner View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={hideBannerView}>
            <Text style={styles.buttonText}>Hide Banner View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePredictedEcpm}>
            <Text style={styles.buttonText}>Get Predicted eCPM</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCanShow}>
            <Text style={styles.buttonText}>Check Can Show</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>

          {/* Banner View Container */}
          {showBanner ? (
            <View style={bannerStyles.bannerWrapper}>
              <Text style={bannerStyles.bannerLabel}>
                BANNER VIEW COMPONENT
              </Text>
              <AppodealBanner
                style={bannerStyles.bannerView}
                adSize="phone"
                onAdLoaded={onAdLoadedEvent}
                onAdFailedToLoad={onAdFailedToLoadEvent}
                onAdClicked={onAdClickedEvent}
                onAdExpired={onAdExpiredEvent}
              />
            </View>
          ) : (
            <View style={bannerStyles.placeholderContainer}>
              <Text style={bannerStyles.placeholderText}>
                Tap "Show Banner View" to display the banner component
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  statusContainer: {
    backgroundColor: '#E8F4FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  bannerWrapper: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#FFE5E5',
    borderWidth: 2,
    borderColor: '#FF3B30',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
  },
  bannerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10,
  },
  bannerView: {
    height: 50,
    width: 320,
    backgroundColor: '#FFF',
  },
  placeholderContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
