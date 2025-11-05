import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { apiService } from './src/services/api';

export default function App() {
  const [widgetToken, setWidgetToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWidget();
  }, []);

  const loadWidget = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await apiService.getWidgetToken();
      setWidgetToken(token);
    } catch (err: any) {
      console.error('Failed to load widget:', err);
      setError(err.message || 'Failed to load widget');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading widget...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Please check your credentials in .env file
        </Text>
      </View>
    );
  }

  if (!widgetToken) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No widget token available</Text>
      </View>
    );
  }

  const widgetBaseUrl = process.env.EXPO_PUBLIC_WIDGET_BASE_URL || 'https://widget.transactionlink.io';
  const widgetScriptUrl = `${widgetBaseUrl}/transactionlink-widget.umd.js`;
  const timestamp = Date.now();

  const htmlContent = `
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
              token: '${widgetToken}',
              inline: true,
              autoHeight: true
            });
            window.transactionlink.open();
          };
        </script>
        <script src="${widgetScriptUrl}?v=${timestamp}"></script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent, baseUrl: widgetBaseUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error:', nativeEvent);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  webview: {
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
