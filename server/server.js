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

async function authorize() {
    const response = await axios.post(`${API_HOST}/auth/authorize`, {
        key: WIDGET_API_KEY,
        secret: WIDGET_SECRET_KEY,
    }, {
        headers: {
            Accept: 'application/json;version=2',
            'Content-Type': 'application/json',
        },
    })

    console.log('Access token received:', response.data.accessToken)
    return response.data.accessToken
}

app.post('/workflow-execution', async (req, res) => {
    const executionPayload = {
        recordId: uuid.v4(),
        workflowDefinitionId: WORKFLOW_DEFINITION_ID,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        locale: 'en',
    }

    const execution = await axios.post(
        `${API_HOST}/workflows`,
        executionPayload,
        {
            headers: {
                Authorization: `Bearer ${await authorize()}`,
                'Content-Type': 'application/json',
            },
        },
    )

    console.log('Workflow execution created:', execution.data)

    res.send({
        link: execution.data.link,
        token: execution.data.token,
        workflowId: execution.data.id,
    })
})

app.get('/workflow-status', async (req, res) => {
    const workflowId = req.query.workflowId

    const workflow = await axios.get(
        `${API_HOST}/workflows/${workflowId}`,
        {
            headers: {
                Authorization: `Bearer ${await authorize()}`,
            },
        },
    )

    res.send({
        status: workflow.data.status,
        workflowId: workflow.data.id,
    })
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))
