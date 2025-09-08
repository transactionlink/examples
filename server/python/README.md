# Transactionlink example - Python backend with flask

See https://docs.transactionlink.io/ for full info.

This is a minimal server-side example in Flask. It calls Transactionlink's public API and exposes endpoints for the frontend examples. Its role is to hide Transactionlink API credentials on the server-side.

To run the full end-to-end example, you also need to run the frontend part of your choice.

## Virtual environment

It is recommended to make a virtual environment

    - `python -m venv env`
    - `source env/bin/activate`

## Configuration

Before running, make sure to put your credentials in variables in `server.js`:

```
WIDGET_API_KEY = "[your widget API key]" # TODO put your data
WIDGET_SECRET_KEY = "[your widget secret key]" # TODO put your data
WORKFLOW_DEFINITION_ID = "[your workflow definition id]" # TODO put your data
```
**Note:** Never expose Transactionlink `WIDGET_SECRET_KEY` in frontend code.

## Running

In order to run the example server:
- place your credentials and workflow definition ID in `server.py` correctly,
- run `pip install -r requirements.txt` to install dependencies and `python server.py` to start the server,
- run the frontend example of your choice (see main README.md).
