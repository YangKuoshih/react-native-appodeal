import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Appodeal, {
  AppodealAdType,
  AppodealBannerEvents,
} from 'react-native-appodeal';
import type { NavigationProps } from '../App';
import { commonStyles as styles } from '../styles/common';

interface BannerScreenProps {
  navigation: NavigationProps;
}

export default function BannerScreen({ navigation }: BannerScreenProps) {
  const [bannerStatus, setBannerStatus] = useState('Not loaded');
  const [bannerPosition, setBannerPosition] = useState<'top' | 'bottom' | 'none'>('none');

  const showTopBanner = () => {
    setBannerPosition('top');
    setBannerStatus('Attempting to show top banner...');
    Appodeal.show(AppodealAdType.BANNER_TOP);
  };

  const showBottomBanner = () => {
    setBannerPosition('bottom');
    setBannerStatus('Attempting to show bottom banner...');
    Appodeal.show(AppodealAdType.BANNER_BOTTOM);
  };

  const hideBanner = () => {
    setBannerPosition('none');
    setBannerStatus('Banner hidden');
    Appodeal.hide(AppodealAdType.BANNER);
  };

  const cacheBanner = () => {
    setBannerStatus('Caching banner ads...');
    Appodeal.cache(AppodealAdType.BANNER);
    console.log('📥 Manually caching banner ads');
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

  React.useEffect(() => {
    // Subscribe to banner events with detailed logging
    const onLoaded = (event: any) => {
      console.log('🎉 ========== BANNER LOADED ==========');
      console.log('Banner loaded event:', JSON.stringify(event, null, 2));
      console.log('Height:', event.height);
      console.log('Is Precache:', event.isPrecache);
      console.log('=====================================');
      setBannerStatus(`✅ Banner loaded! Height: ${event.height}px`);
    };
    const onFailedToLoad = (error: any) => {
      console.log('❌ ========== BANNER FAILED TO LOAD ==========');
      console.log('Banner failed to load error:', JSON.stringify(error, null, 2));
      console.log('Error details:', error);
      console.log('==============================================');
      setBannerStatus('❌ Banner failed to load');
    };
    const onExpired = () => {
      console.log('⚠️ Banner expired');
      setBannerStatus('⚠️ Banner expired');
    };
    const onShown = () => {
      console.log('✅ ========== BANNER SHOWN ==========');
      console.log('Banner is now visible on screen');
      console.log('=====================================');
      setBannerStatus('✅ Banner is showing');
    };
    const onClicked = () => {
      console.log('👆 Banner clicked!');
      setBannerStatus('👆 Banner clicked!');
    };

    Appodeal.addEventListener(AppodealBannerEvents.LOADED, onLoaded);
    Appodeal.addEventListener(
      AppodealBannerEvents.FAILED_TO_LOAD,
      onFailedToLoad
    );
    Appodeal.addEventListener(AppodealBannerEvents.EXPIRED, onExpired);
    Appodeal.addEventListener(AppodealBannerEvents.SHOWN, onShown);
    Appodeal.addEventListener(AppodealBannerEvents.CLICKED, onClicked);

    return () => {
      Appodeal.removeEventListener(AppodealBannerEvents.LOADED, onLoaded);
      Appodeal.removeEventListener(
        AppodealBannerEvents.FAILED_TO_LOAD,
        onFailedToLoad
      );
      Appodeal.removeEventListener(AppodealBannerEvents.EXPIRED, onExpired);
      Appodeal.removeEventListener(AppodealBannerEvents.SHOWN, onShown);
      Appodeal.removeEventListener(AppodealBannerEvents.CLICKED, onClicked);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Banner Container */}
      {bannerPosition === 'top' && (
        <View style={bannerStyles.bannerContainer}>
          <Text style={bannerStyles.bannerLabel}>TOP BANNER AD AREA</Text>
          <Text style={bannerStyles.bannerHint}>
            Banner will appear here when loaded
          </Text>
        </View>
      )}

      <ScrollView style={styles.screenContainer}>
        <View style={styles.content}>
          {/* Status Display */}
          <View style={bannerStyles.statusContainer}>
            <Text style={bannerStyles.statusLabel}>Status:</Text>
            <Text style={bannerStyles.statusText}>{bannerStatus}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={showTopBanner}>
            <Text style={styles.buttonText}>Show Top Banner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showBottomBanner}>
            <Text style={styles.buttonText}>Show Bottom Banner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={hideBanner}>
            <Text style={styles.buttonText}>Hide Banner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#34C759' }]}
            onPress={cacheBanner}
          >
            <Text style={styles.buttonText}>📥 Cache Banner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePredictedEcpm}>
            <Text style={styles.buttonText}>Get Predicted eCPM</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCanShow}>
            <Text style={styles.buttonText}>Can Show Banner?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Banner Container */}
      {bannerPosition === 'bottom' && (
        <View style={bannerStyles.bannerContainer}>
          <Text style={bannerStyles.bannerLabel}>BOTTOM BANNER AD AREA</Text>
          <Text style={bannerStyles.bannerHint}>
            Banner will appear here when loaded
          </Text>
        </View>
      )}
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  bannerContainer: {
    height: 50,
    backgroundColor: '#FFE5E5',
    borderWidth: 2,
    borderColor: '#FF3B30',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  bannerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  bannerHint: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
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
});
