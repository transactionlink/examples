package com.example.transactionlink.data.repository

import android.util.Log
import com.example.transactionlink.data.api.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Repository for communicating with the backend server
 * The backend server handles API authentication securely - no secrets are stored in this app
 */
class TransactionlinkRepository {

    private val backendService = RetrofitClient.apiService

    /**
     * Gets widget token from backend server
     * The backend handles authentication and workflow creation
     */
    suspend fun getWidgetToken(parameters: Map<String, @JvmSuppressWildcards Any> = emptyMap()): Result<String> = withContext(Dispatchers.IO) {
        try {
            val response = backendService.createWorkflowExecution(parameters)

            Log.d("TransactionlinkRepo", "Workflow created: ${response.workflowId}")
            Log.d("TransactionlinkRepo", "Widget token received")

            Result.success(response.token)
        } catch (e: Exception) {
            Log.e("TransactionlinkRepo", "Failed to get widget token", e)
            Result.failure(e)
        }
    }

    /**
     * Gets workflow status from backend server
     */
    suspend fun getWorkflowStatus(workflowId: String): Result<String> = withContext(Dispatchers.IO) {
        try {
            val response = backendService.getWorkflowStatus(workflowId)

            Log.d("TransactionlinkRepo", "Workflow status: ${response.status}")

            Result.success(response.status)
        } catch (e: Exception) {
            Log.e("TransactionlinkRepo", "Failed to get workflow status", e)
            Result.failure(e)
        }
    }
}
