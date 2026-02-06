# Example App Configuration

This example app demonstrates how to integrate the `react-native-appodeal` SDK.

## Setup Your Own Keys

The example uses environment variables to keep API keys secure. Follow these steps:

### 1. Copy the environment template

```bash
cp .env.example .env
```

### 2. Edit `.env` with your keys

Open `.env` and replace the placeholder values:

```bash
# Your Appodeal App Key (from Appodeal Dashboard)
APPODEAL_APP_KEY=your_actual_appodeal_key_here

# AdMob App IDs (from Google AdMob Dashboard)
ADMOB_APP_ID_IOS=ca-app-pub-xxxx~yyyy
ADMOB_APP_ID_ANDROID=ca-app-pub-xxxx~yyyy
```

### 3. Update Native Configuration

#### iOS (Info.plist)
Replace `ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy` with your iOS AdMob App ID:

```xml
<key>GADApplicationIdentifier</key>
<string>YOUR_IOS_ADMOB_APP_ID</string>
```

#### Android (AndroidManifest.xml)
Replace `ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy` with your Android AdMob App ID:

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="YOUR_ANDROID_ADMOB_APP_ID"/>
```

### 4. Install dependencies

```bash
npm install react-native-config
```

### 5. Run the app

```bash
# iOS
npm run ios

# Android
npm run android
```

## Demo Mode

If you don't have your own Appodeal account, the app will use demo values that allow basic testing of the SDK integration.

## Security Notes

- **NEVER** commit your `.env` file to git
- The `.env` file is automatically gitignored
- Share only the `.env.example` template
- Each developer should create their own `.env` file
