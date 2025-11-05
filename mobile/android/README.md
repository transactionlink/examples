# Transactionlink example - Android client

See https://docs.transactionlink.io/ for full info.

This is a native Android integration example of Transactionlink widget. It demonstrates the minimal code needed to run Transactionlink widget in a WebView, including authentication and workflow execution.

Unlike frontend examples, the Android app handles both client and server logic within the application. The server-side part (API authentication and workflow creation) is implemented in the Repository layer and should be adapted for production use by moving it to a secure backend.

## Configuration

Before running, make sure to put your credentials in `Config.kt`:

```kotlin
object Config {
    const val API_KEY = "[your widget API key]"
    const val API_SECRET = "[your widget secret key]"
    const val WORKFLOW_DEFINITION_ID = "[your workflow definition id]"

    const val API_BASE_URL = "https://api.transactionlink.io/"
    const val WIDGET_BASE_URL = "https://widget.transactionlink.io"
    const val LOCALE = "en"
}
```

**Note:** In production environments, API credentials should be stored on a secure backend server, not in the mobile app. This example includes server-side logic for demonstration purposes only.

## Running

In order to run the example:
- place your credentials and workflow definition ID in `Config.kt` correctly,
- open the project in Android Studio,
- sync Gradle files and run the app on an emulator or device.

## How it works

1. App authenticates with Transactionlink API using credentials from `Config.kt`
2. Creates a new workflow instance for the specified workflow definition
3. Receives a widget token from the API response
4. Loads the widget in a WebView using the token

## Project structure

```
app/src/main/java/com/example/transactionlink/
├── Config.kt                    # API configuration
├── MainActivity.kt              # Main activity with WebView
├── data/
│   ├── api/                     # Retrofit API interfaces
│   ├── models/                  # Data models
│   └── repository/              # API integration layer
└── ui/theme/                    # Compose UI theme
```
