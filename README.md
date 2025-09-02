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

### server/node

This is a minimal server-side example in Node.js. It calls Transactionlink's public API and exposes endpoints for the frontend examples. Its role is to hide Transactionlink API credentials on the server-side.

In order to run it:
- place your credentials and workflow definition ID in `server/node/server.js` correctly,
- run `npm install` to install dependencies and `npm start` to start the server,
- run the frontend example of your choice (see below).

## client

### client/vanilla

This is a frontend example in plain JavaScript. The minimal code needed to run Transactionlink widget in both modes (hosted and embedded).

In order to run it:
- make sure your server is running on port 8101 (see above),
- run `npm install` to install dependencies and `npm start` to start the server - it will serve static files from `client/vanilla` folder on port 8100,
- choose either `hosted.html` or `embedded.html` in your browser.

### client/react

This is another frontend example in React + TypeScript. It covers the same basic functionality as Vanilla example, but wrapped in React components.

In order to run it:
- make sure your server is running on port 8101 (see above),
- run `npm install` to install dependencies and `npm dev` to start the server in the dev mode - it will serve React application from `client/react` folder on port 8100,
- choose either hosted or embedded experience.
