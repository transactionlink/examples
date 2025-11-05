package com.example.transactionlink.data.repository

import android.util.Log
import com.example.transactionlink.Config
import com.example.transactionlink.data.api.RetrofitClient
import com.example.transactionlink.data.models.AuthRequest
import com.example.transactionlink.data.models.WorkflowRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class TransactionlinkRepository {

    private val apiService = RetrofitClient.apiService
    private var cachedAccessToken: String? = null

    /**
     * Authorizes with API and returns access token
     */
    private suspend fun authorize(): Result<String> = withContext(Dispatchers.IO) {
        try {
            val authRequest = AuthRequest(
                key = Config.API_KEY,
                secret = Config.API_SECRET
            )
            val response = apiService.authorize(authRequest)
            cachedAccessToken = response.accessToken
            Log.d("TransactionlinkRepo", "Authorization successful")
            Result.success(response.accessToken)
        } catch (e: Exception) {
            Log.e("TransactionlinkRepo", "Authorization failed", e)
            Result.failure(e)
        }
    }

    /**
     * Runs workflow and returns widget token
     */
    suspend fun getWidgetToken(): Result<String> = withContext(Dispatchers.IO) {
        try {
            // First, authorize
            val authResult = authorize()
            if (authResult.isFailure) {
                return@withContext Result.failure(
                    authResult.exceptionOrNull() ?: Exception("Authorization failed")
                )
            }

            val accessToken = authResult.getOrNull() ?: return@withContext Result.failure(
                Exception("Access token is null")
            )

            // Now run workflow
            val workflowRequest = WorkflowRequest(
                workflowDefinitionId = Config.WORKFLOW_DEFINITION_ID,
                locale = Config.LOCALE,
                parameters = emptyMap()
            )

            val workflowResponse = apiService.runWorkflow(
                authorization = "Bearer $accessToken",
                workflowRequest = workflowRequest
            )

            Log.d("TransactionlinkRepo", "Workflow started: ${workflowResponse.id}")
            Log.d("TransactionlinkRepo", "Widget link: ${workflowResponse.link}")

            // Extract token from link
            val token = extractTokenFromLink(workflowResponse.link)
                ?: workflowResponse.token

            Result.success(token)
        } catch (e: Exception) {
            Log.e("TransactionlinkRepo", "Failed to get widget token", e)
            Result.failure(e)
        }
    }

    /**
     * Extracts token from link like: https://link.transactionlink.io?token=xyz
     */
    private fun extractTokenFromLink(link: String): String? {
        return try {
            val uri = android.net.Uri.parse(link)
            uri.getQueryParameter("token")
        } catch (e: Exception) {
            Log.e("TransactionlinkRepo", "Failed to extract token from link", e)
            null
        }
    }
}
