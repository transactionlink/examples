# Transactionlink Example - React Native Expo

See https://docs.transactionlink.io/ for full info.

This is a React Native Expo integration example of Transactionlink widget. It demonstrates the minimal code needed to run Transactionlink widget in a WebView, including authentication and workflow execution.

This example is similar to the Android native app but built with React Native Expo for cross-platform development (iOS & Android).

## Configuration

Before running, copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`

**Note:** In production environments, API credentials should be stored on a secure backend server, not in the mobile app. This example includes server-side logic (authentication and workflow creation) for demonstration purposes only.

## Installation

Install dependencies:

```bash
npm install
```

## Running

### Development (Expo Go)

```bash
# Start the development server
npm start

# Run on Android (generates android/ folder automatically)
npm run android

# Run on iOS (generates ios/ folder automatically - macOS only)
npm run ios
```

**Note:** The `android/` and `ios/` folders are generated automatically by Expo when you run the app. They are gitignored and shouldn't be committed to the repository.

### Production Build

For production E2E testing, build locally:

#### Prerequisites

**Android:**
- Android Studio installed
- Android SDK configured with `ANDROID_HOME` environment variable set:
  ```bash
  # Add to your ~/.zshrc or ~/.bash_profile
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```
  Then run: `source ~/.zshrc` (or `source ~/.bash_profile`)
- Emulator or physical device connected

**iOS (macOS only):**
- Xcode installed
- CocoaPods installed (`sudo gem install cocoapods`)
- iOS Simulator or physical device

#### Build Commands

```bash
# Build for Android (creates release APK)
npm run build:android

# Build for iOS (creates release build)
npm run build:ios
```

The builds will be installed directly on your connected device or emulator.

## How it works

1. App authenticates with Transactionlink API using credentials from `.env` file
2. Creates a new workflow instance for the specified workflow definition
3. Receives a widget token from the API response
4. Loads the widget in a WebView using the token

## Testing E2E

For end-to-end testing on actual devices:

1. **Configure credentials** in `.env` file
2. **Connect your device** or start emulator/simulator
3. **Run build command:**
   - Android: `npm run build:android`
   - iOS: `npm run build:ios`
4. **Test the complete workflow** on device

## Troubleshooting

### App shows "Authentication Failed"
- Check your API credentials in `.env` file
- Verify your API key and secret are correct
- Make sure you copied `.env.example` to `.env`

### Build fails

**Android "SDK location not found":**
- Set `ANDROID_HOME` environment variable (see Prerequisites)
- Verify SDK path: `echo $ANDROID_HOME` (should show path to Android SDK)
- Restart terminal after setting environment variables

**Other Android issues:**
- Ensure Android Studio and SDK are properly installed
- Clear caches: `npx expo start -c`

**iOS issues:**
- Run `npx pod-install` to install CocoaPods dependencies
- Clean build folder in Xcode
- Clear caches: `npx expo start -c`

### WebView not loading
- Ensure JavaScript is enabled (it is by default)
- Check network connectivity
- Review console logs for errors

