# Transactionlink integration examples

See https://docs.transactionlink.io/ for full info.

This repository contains minimal examples of how to integrate Transactionlink widget in different environments. It consists of two parts: a server-side part and a frontend (client) part. The role of the server-side is to hide Transactionlink API credentials and call Transactionlink's public API. The frontend part is responsible for rendering the widget in the browser, either in hosted or embedded mode.

## server

Before running, make sure to put your credentials in variables, according to the backend technology used, i.e. for Node.js:

```
const WIDGET_API_KEY = '[your widget API key]'; //  put your credentials
const WIDGET_SECRET_KEY = '[your widget secret key]'; // put your credentials
const WORKFLOW_DEFINITION_ID = '[your workflow definition id]'; // put your workflow definition ID
```

**Note:** Never expose Transactionlink `WIDGET_SECRET_KEY` in frontend code.

Example implementations:
* [server/node](server/node/README.md) - Node.js backend
* [server/python](server/python/README.md) - Python (flask) backend

## client

Web client example implementations:
* [client/vanilla](client/vanilla/README.md) - plain JavaScript frontend
* [client/react](client/react/README.md) - React + TypeScript frontend

## mobile

Mobile app example implementations:
* [mobile/android](mobile/android/README.md) - Android native app (Kotlin + Jetpack Compose)
* [mobile/react-native-expo](mobile/react-native-expo/README.md) - React Native Expo app (iOS & Android)
