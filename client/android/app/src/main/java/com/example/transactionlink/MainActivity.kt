package com.example.transactionlink

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.viewinterop.AndroidView
import com.example.transactionlink.data.repository.TransactionlinkRepository
import com.example.transactionlink.ui.theme.TransactionlinkTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TransactionlinkTheme {
                TransactionlinkWebView()
            }
        }
    }
}

@Composable
fun TransactionlinkWebView() {
    val repository = remember { TransactionlinkRepository() }
    var widgetToken by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        val result = repository.getWidgetToken()
        result.fold(
            onSuccess = { token ->
                widgetToken = token
                isLoading = false
            },
            onFailure = { exception ->
                error = exception.message ?: "Unknown error"
                isLoading = false
            }
        )
    }

    when {
        isLoading -> {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        }
        error != null -> {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text("Error: $error")
            }
        }
        widgetToken != null -> {
            WebViewContent(widgetToken = widgetToken!!)
        }
    }
}

@Composable
fun WebViewContent(widgetToken: String) {
    val context = LocalContext.current
    val baseUrl = Config.WIDGET_BASE_URL
    val widgetScriptUrl = "$baseUrl/transactionlink-widget.umd.js"

    // State for file upload callback
    var filePathCallback by remember { mutableStateOf<ValueCallback<Array<Uri>>?>(null) }

    // Permission launcher for storage access (Android 13+)
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        // Permissions handled, file picker will be launched from onShowFileChooser
    }

    // Request permissions on first composition (Android 13+)
    LaunchedEffect(Unit) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            permissionLauncher.launch(
                arrayOf(
                    android.Manifest.permission.READ_MEDIA_IMAGES,
                    android.Manifest.permission.READ_MEDIA_VIDEO,
                    android.Manifest.permission.READ_MEDIA_AUDIO
                )
            )
        }
    }

    // File picker launcher
    val filePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val results = if (result.resultCode == Activity.RESULT_OK) {
            result.data?.data?.let { arrayOf(it) }
        } else {
            null  // User cancelled - send null
        }

        // CRITICAL: Always call onReceiveValue, even if null
        // If we don't, WebView will crash on next file input click
        filePathCallback?.onReceiveValue(results)
        filePathCallback = null
    }

    val htmlContent = """
        <!DOCTYPE HTML>
        <html>
          <head>
            <title>Transactionlink.io widget</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          </head>
          <body>
            <h1>transactionlink.io widget webview test page</h1>
            <div style="border: 1px solid red">
              <transactionlink-widget />
            </div>
            <script>
              window.transactionlink_ready = () => {
                transactionlink.setOptions({
                  token: '$widgetToken',
                  inline: true,
                  autoHeight: true
                });
                window.transactionlink.open();
              };
            </script>
            <script src="$widgetScriptUrl?v=${System.currentTimeMillis()}"></script>
          </body>
        </html>
    """.trimIndent()

    AndroidView(
        factory = { context ->
            WebView(context).apply {
                webViewClient = WebViewClient()

                webChromeClient = object : WebChromeClient() {
                    override fun onShowFileChooser(
                        webView: WebView?,
                        callback: ValueCallback<Array<Uri>>?,
                        fileChooserParams: FileChooserParams?
                    ): Boolean {
                        // CRITICAL: Cancel any existing callback first
                        // This prevents WebView from getting stuck
                        filePathCallback?.onReceiveValue(null)

                        // Store new callback
                        filePathCallback = callback

                        // Create file picker intent
                        val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                            type = "*/*"  // Allow all file types (images, PDF, documents, etc.)
                            // Uncomment below to restrict to specific types:
                            // type = "image/*"  // Only images
                            // type = "application/pdf"  // Only PDF
                            // putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "application/pdf"))  // Images + PDF
                            addCategory(Intent.CATEGORY_OPENABLE)
                        }

                        // Allow multiple files if specified
                        if (fileChooserParams?.mode == FileChooserParams.MODE_OPEN_MULTIPLE) {
                            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                        }

                        try {
                            filePickerLauncher.launch(intent)
                            return true
                        } catch (e: Exception) {
                            // If launching failed, cleanup callback
                            filePathCallback?.onReceiveValue(null)
                            filePathCallback = null
                            return false
                        }
                    }
                }
                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    allowFileAccess = true  // Changed to true for file uploads
                    allowContentAccess = true  // Changed to true for file uploads
                    setSupportZoom(false)
                }
                loadDataWithBaseURL(
                    baseUrl,
                    htmlContent,
                    "text/html",
                    "UTF-8",
                    null
                )
            }
        },
        modifier = Modifier.fillMaxSize()
    )
}

@Preview(showBackground = false)
@Composable
fun TransactionlinkWebViewPreview() {
    TransactionlinkTheme {
        TransactionlinkWebView()
    }
}