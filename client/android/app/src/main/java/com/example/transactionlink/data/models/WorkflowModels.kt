package com.example.transactionlink.data.models

import com.google.gson.annotations.SerializedName

data class WorkflowRequest(
    @SerializedName("workflowDefinitionId")
    val workflowDefinitionId: String,
    @SerializedName("locale")
    val locale: String,
    @SerializedName("parameters")
    val parameters: Map<String, Any> = emptyMap()
)

/**
 * Workflow API response
 * Minimal model containing only fields actually used by the app:
 * - id: for logging workflow execution
 * - token: widget authentication token (fallback)
 * - link: URL containing token as query parameter (primary source)
 */
data class WorkflowResponse(
    @SerializedName("id")
    val id: String,
    @SerializedName("token")
    val token: String,
    @SerializedName("link")
    val link: String
)
