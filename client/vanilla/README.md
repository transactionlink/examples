# Transactionlink example - vanilla JS frontend

See https://docs.transactionlink.io/ for full info.

This is a frontend Transactionlink integration example in plain JavaScript. The minimal code needed to run Transactionlink widget in both modes (hosted and embedded).

To run the full end-to-end example, you also need to run the server-side part of your choice.

## Running

In order to run the example:
- make sure your backend server is running on port 8101,
- run `npm install` to install dependencies and `npm start` to start the server - it will serve static files from `client/vanilla` folder on port 8100,
- choose either `hosted.html` or `embedded.html` in your browser.

## Redirect after the workflow

A workflow can send the user to an address with a **Redirect** task.

- `hosted.html`: the widget opens the address itself.
- `embedded.html`: the widget does not leave your page. It sends the `redirect-requested` event with `{ url }`, and the page opens the address with `window.location.assign(url)`. Change this handler to keep the user on your page.
