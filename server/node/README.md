# Transactionlink example - Node backend

See https://docs.transactionlink.io/ for full info.

This is a minimal server-side Transactionlink integration example in Node.js. It calls Transactionlink's public API and exposes endpoints for the frontend examples. Its role is to hide Transactionlink API credentials on the server-side.

To run the full end-to-end example, you also need to run the frontend part of your choice.

## Configuration

Before running, make sure to put your credentials in variables in `server.js`:

```
const WIDGET_API_KEY = '[your widget API key]'; //  put your credentials
const WIDGET_SECRET_KEY = '[your widget secret key]'; // put your credentials
const WORKFLOW_DEFINITION_ID = '[your workflow definition id]'; // put your workflow definition ID
```

**Note:** Never expose Transactionlink `WIDGET_SECRET_KEY` in frontend code.

## Running

In order to run the example server:
- place your credentials and workflow definition ID in `server.js` correctly,
- run `npm install` to install dependencies and `npm start` to start the server,
- run the frontend example of your choice (see below).
