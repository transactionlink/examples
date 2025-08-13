const axios = require('axios')
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}))

const WIDGET_API_KEY = '[your widget API key]' // TODO put your data
const WIDGET_SECRET_KEY = '[your widget secret key]' // TODO put your data
const WORKFLOW_DEFINITION_ID = '[your workflow definition id]' // TODO put your data

const PORT = process.env.PORT || 8101 // Port for the server
const API_HOST = 'https://api.transactionlink.io' // API host for TransactionLink

async function getToken() {
    const token = await axios.post(`${API_HOST}/auth/authorize`, {
        key: WIDGET_API_KEY,
        secret: WIDGET_SECRET_KEY,
    }, {
        headers: {
            Accept: 'application/json;version=2',
            'Content-Type': 'application/json',
        },
    })

    console.log('Token received:', token.data.accessToken)
    return token.data.accessToken
}

async function createWorkflowExecution(uiMode) {
    const executionPayload = {
        recordId: uuid.v4(),
        workflowDefinitionId: WORKFLOW_DEFINITION_ID,
        parametersId: uuid.v4(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        uiMode,
        locale: 'en',
    }

    const execution = await axios.post(
        `${API_HOST}/workflows`,
        executionPayload,
        {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
                'Content-Type': 'application/json',
            },
        },
    )

    console.log('Workflow execution created:', execution.data)
    return execution.data
}

app.post('/create-workflow-execution-hosted', async (req, res) => {
    const execution = await createWorkflowExecution('hosted')
    res.send({
        link: execution.link,
        workflowId: execution.id,
    })
})

app.post('/create-workflow-execution-embedded', async (req, res) => {
    const execution = await createWorkflowExecution('embedded')
    res.send({
        token: execution.token,
        workflowId: execution.id,
    })
})

app.get('/workflow-status', async (req, res) => {
    const workflowId = req.query.workflowId

    const workflow = await axios.get(
        `${API_HOST}/workflows/${workflowId}`,
        {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        },
    )

    res.send({
        status: workflow.data.status,
        workflowId: workflow.data.id,
    })
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))
