# Transactionlink example - Android client

See https://docs.transactionlink.io/ for full info.

This is a native Android integration example of Transactionlink widget. It demonstrates how to securely integrate the Transactionlink widget in a mobile app by using a backend server to handle API secrets.

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

Before running, copy `Config.kt.example` to `Config.kt`:

```bash
cp app/src/main/java/com/example/transactionlink/Config.kt.example \
   app/src/main/java/com/example/transactionlink/Config.kt
```

Edit `Config.kt` to set your deployed backend server URL:

```kotlin
object Config {
    const val BACKEND_URL = "https://your-backend-server.com"
    const val WIDGET_BASE_URL = "https://widget.transactionlink.io"
}
```

**For local development**, use platform-specific addresses:
- **Android emulator**: `http://10.0.2.2:8101` (emulator's special alias for host's localhost)
- **Physical device**: `http://YOUR_LOCAL_IP:8101` (e.g., `http://192.168.1.100:8101`)

## Technical Details

This example is built with:
- **Jetpack Compose** - Modern Android UI toolkit
- **Kotlin Coroutines** - Asynchronous programming
- **Retrofit + OkHttp** - HTTP client for backend communication
- **WebView** - For displaying the Transactionlink widget
- **Minimum SDK**: Android 7.0 (API 24)
- **Target SDK**: Android 14 (API 36)

### Key Features
- Secure backend communication (API secrets never stored in app)
- File upload support for widget document uploads
- Network security configuration for local development
- Error handling and loading states

## Running

In order to run the example:
1. Ensure you have a deployed backend server with your API credentials (see Prerequisites)
2. Copy and configure `Config.kt` from `Config.kt.example` with your backend URL
3. Open the project in Android Studio
4. Sync Gradle files
5. Run the app on an emulator or device

## Troubleshooting

### App shows connection errors
- Verify `BACKEND_URL` in `Config.kt` points to your deployed backend
- Ensure your backend server is running and accessible
- Check that your backend URL uses HTTPS in production
- For local development:
  - Android emulator: Use `http://10.0.2.2:8101`
  - Physical device: Use your computer's local IP (e.g., `http://192.168.1.100:8101`)
  - Ensure your local backend server is running

### CLEARTEXT communication error
If you see an error like "CLEARTEXT communication to X.X.X.X not permitted by network security policy":

This happens because Android 9+ blocks unencrypted HTTP traffic by default. For local development with HTTP, the app includes a network security configuration (`app/src/main/res/xml/network_security_config.xml`) that allows cleartext traffic to local addresses.

**If you need to add more local IPs:**
1. Edit `app/src/main/res/xml/network_security_config.xml`
2. Add your IP address to the `<domain-config>` section:
   ```xml
   <domain includeSubdomains="true">YOUR_LOCAL_IP</domain>
   ```
3. Rebuild the app

**For production:** Always use HTTPS. Remove or restrict the network security configuration before releasing your app.

### Widget shows authentication errors
- Check API credentials in your deployed backend server
- Verify your API key and secret are correct
- Check your backend server logs for authentication errors

## Project structure

```
app/src/main/java/com/example/transactionlink/
├── Config.kt                    # Backend URL configuration
├── MainActivity.kt              # Main activity with WebView and Compose UI
├── data/
│   ├── api/
│   │   ├── RetrofitClient.kt           # Retrofit HTTP client setup
│   │   └── TransactionlinkApiService.kt # Backend API endpoints
│   ├── models/
│   │   └── WorkflowModels.kt           # API response models
│   └── repository/
│       └── TransactionlinkRepository.kt # Backend communication layer
└── ui/theme/                    # Jetpack Compose UI theme
    ├── Color.kt
    ├── Theme.kt
    └── Type.kt
```
