package com.example.transactionlink.data.models

import com.google.gson.annotations.SerializedName

/**
 * Backend API response for workflow execution
 * Contains the widget token and link from the backend server
 */
data class WorkflowExecutionResponse(
    @SerializedName("link")
    val link: String,
    @SerializedName("token")
    val token: String,
    @SerializedName("workflowId")
    val workflowId: String
)

/**
 * Backend API response for workflow status
 */
data class WorkflowStatusResponse(
    @SerializedName("status")
    val status: String,
    @SerializedName("workflowId")
    val workflowId: String
)
