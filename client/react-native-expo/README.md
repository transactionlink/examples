# Transactionlink Example - React Native Expo

See https://docs.transactionlink.io/ for full info.

This is a React Native Expo integration example of Transactionlink widget. It demonstrates how to securely integrate the Transactionlink widget in a mobile app by using a backend server to handle API secrets.

This example is similar to the Android native app but built with React Native Expo for cross-platform development (iOS & Android).

## Architecture

**IMPORTANT SECURITY NOTE:** This example follows security best practices by keeping API secrets on the backend server, not in the mobile app. The mobile app communicates with your backend, which handles authentication with Transactionlink API.

### How it works:
1. Mobile app calls your backend server's `/workflow-execution` endpoint
2. Backend server authenticates with Transactionlink API using API credentials (stored securely on backend)
3. Backend creates a workflow and returns the widget token to the mobile app
4. Mobile app loads the widget using the token

## Prerequisites

This mobile app requires a backend server to handle API credentials securely:

1. **Deploy the backend**: Choose `server/node/` or `server/python/` from this repository
2. **Configure credentials**: Set your API credentials in the backend server
3. **Deploy it**: Deploy to your hosting provider (e.g., Heroku, AWS, Google Cloud, etc.)
4. **Get the URL**: Note your deployed backend URL

### For local development only

If you want to test locally before deploying:

1. Navigate to `server/node/` or `server/python/`
2. Follow setup instructions and configure API credentials
3. Start the backend server locally (default: http://localhost:8101)
4. Use platform-specific URLs in mobile app (see Configuration below)

## Configuration

Copy `.env.example` to `.env` and configure your backend URL:

```bash
cp .env.example .env
```

Edit `.env` to set your deployed backend server URL:
```env
EXPO_PUBLIC_BACKEND_URL=https://your-backend-server.com
```

**For local development**, use platform-specific addresses:
- **Android emulator**: `http://10.0.2.2:8101`
- **iOS simulator**: `http://localhost:8101`
- **Physical device**: `http://YOUR_LOCAL_IP:8101` (e.g., `http://192.168.1.100:8101`)

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

1. Mobile app calls backend server's `/workflow-execution` endpoint
2. Backend server authenticates with Transactionlink API (credentials stored securely on backend)
3. Backend creates a workflow and returns widget token to mobile app
4. Mobile app loads the widget in a WebView using the token

## Testing E2E

For end-to-end testing on actual devices:

1. **Deploy your backend** or run it locally (see Prerequisites)
2. **Configure backend URL** in `.env` file
3. **Connect your device** or start emulator/simulator
4. **Run build command:**
   - Android: `npm run build:android`
   - iOS: `npm run build:ios`
5. **Test the complete workflow** on device

## Troubleshooting

### App shows connection errors
- Verify `EXPO_PUBLIC_BACKEND_URL` in `.env` points to your deployed backend
- Ensure your backend server is running and accessible
- Check that your backend URL uses HTTPS in production
- For local development:
  - Android emulator: Use `http://10.0.2.2:8101`
  - iOS simulator: Use `http://localhost:8101`
  - Physical device: Use your computer's local IP (e.g., `http://192.168.1.100:8101`)
  - Ensure your local backend server is running

### Widget shows authentication errors
- Check API credentials in your deployed backend server
- Verify your API key and secret are correct
- Check your backend server logs for authentication errors

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

