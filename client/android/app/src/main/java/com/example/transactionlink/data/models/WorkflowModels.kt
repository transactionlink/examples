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

data class WorkflowResponse(
    @SerializedName("id")
    val id: String,
    @SerializedName("workspaceId")
    val workspaceId: String,
    @SerializedName("workflowDefinitionId")
    val workflowDefinitionId: String,
    @SerializedName("parameters")
    val parameters: Map<String, Any>,
    @SerializedName("name")
    val name: String,
    @SerializedName("revision")
    val revision: String,
    @SerializedName("status")
    val status: String,
    @SerializedName("locale")
    val locale: String,
    @SerializedName("expiresAt")
    val expiresAt: String,
    @SerializedName("uiOptions")
    val uiOptions: WorkflowUiOptions,
    @SerializedName("token")
    val token: String,
    @SerializedName("link")
    val link: String,
    @SerializedName("executionType")
    val executionType: String,
    @SerializedName("executionVersion")
    val executionVersion: Int
)

/**
 * UI options for the workflow
 * Note: Can contain additional experimental fields as [key: string]: any
 */
data class WorkflowUiOptions(
    @SerializedName("defaultLanguage")
    val defaultLanguage: String? = null,
    @SerializedName("inline")
    val inline: Boolean? = null,
    @SerializedName("widgetOptions")
    val widgetOptions: WidgetHostingOptions? = null,
    @SerializedName("cssVariables")
    val cssVariables: Map<String, String>? = null,
    @SerializedName("experimentalWidgetComponents")
    val experimentalWidgetComponents: Boolean? = null,
    @SerializedName("forcedBreakpoint")
    val forcedBreakpoint: String? = null
)

/**
 * Widget options for different hosting modes: 'hosted' | 'embedded'
 * - hosted: on the link page
 * - embedded: on a customer site
 *
 * Use case: This Android native app uses the 'embedded' mode to integrate
 * the workflow directly into the mobile application, behaving the same way
 * as if it were embedded on a customer's website.
 */
data class WidgetHostingOptions(
    @SerializedName("hosted")
    val hosted: WidgetUiOptions? = null,
    @SerializedName("embedded")
    val embedded: WidgetUiOptions? = null
)

/**
 * UI options for the widget
 */
data class WidgetUiOptions(
    @SerializedName("inline")
    val inline: Boolean? = null,
    @SerializedName("autoHeight")
    val autoHeight: Boolean? = null,
    @SerializedName("showCloseButton")
    val showCloseButton: Boolean? = null,
    @SerializedName("autoCloseWidget")
    val autoCloseWidget: Boolean? = null,
    @SerializedName("allowUnpromptedWorkflowLeave")
    val allowUnpromptedWorkflowLeave: Boolean? = null,
    @SerializedName("loading")
    val loading: Boolean? = null
)
