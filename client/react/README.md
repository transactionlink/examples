# Transactionlink example - React frontend

See https://docs.transactionlink.io/ for full info.

This is a frontend Transactionlink integration example in React + TypeScript. It covers minimal code needed to run Transactionlink widget in both modes (hosted and embedded), wrapped in React components.

To run the full end-to-end example, you also need to run the server-side part of your choice.

## Running

In order to run the example:
- make sure your backend server is running on port 8101,
- run `npm install` to install dependencies and `npm run dev` to start the server in the dev mode - it will serve React application from `client/react` folder on port 8100,
- choose either hosted or embedded experience.

## Redirect after the workflow

A workflow can send the user to an address with a **Redirect** task.

- Hosted widget: the widget opens the address itself.
- Embedded widget: the widget does not leave your page. It sends the `redirect-requested` event with `{ url }`, and `EmbeddedWidget.tsx` opens the address with `window.location.assign(url)`. Change this handler to keep the user in your application.
