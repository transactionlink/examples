import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app, origins=[r"http://localhost:*"])

WIDGET_API_KEY = "[your widget API key]" # TODO put your data
WIDGET_SECRET_KEY = "[your widget secret key]" # TODO put your data
WORKFLOW_DEFINITION_ID = "[your workflow definition id]" # TODO put your data

PORT = int(os.environ.get("PORT", 8101)) # Port for the server
API_HOST = "https://api.transactionlink.io" # API host for TransactionLink

def authorize():
    response = requests.post(
        f"{API_HOST}/auth/authorize",
        json={
            "key": WIDGET_API_KEY,
            "secret": WIDGET_SECRET_KEY,
        },
        headers={
            "Accept": "application/json;version=2",
            "Content-Type": "application/json",
        },
    )
    response.raise_for_status()
    access_token = response.json().get("accessToken")

    print("Access token received:", access_token)

    return access_token


@app.route("/workflow-execution", methods=["POST"])
def workflow_execution():
    execution_payload = {
        "workflowDefinitionId": WORKFLOW_DEFINITION_ID,
        "locale": "en",
        "parameters": {
            "boolParam": True,
            "textParam": "value"
        }
    }

    token = authorize()

    execution = requests.post(
        f"{API_HOST}/workflows",
        json=execution_payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    data = execution.json()
    print("Workflow execution created:", data)

    execution.raise_for_status()

    return jsonify({
        "link": data.get("link"),
        "token": data.get("token"),
        "workflowId": data.get("id"),
    })

@app.route("/workflow-status", methods=["GET"])
def workflow_status():
    workflow_id = request.args.get("workflowId")
    if not workflow_id:
        return jsonify({"error": "Missing workflowId"}), 400

    token = authorize()

    workflow = requests.get(
        f"{API_HOST}/workflows/{workflow_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    workflow.raise_for_status()
    data = workflow.json()

    return jsonify({
        "status": data.get("status"),
        "workflowId": data.get("id"),
    })

if __name__ == "__main__":
    app.run(port=PORT, debug=True)