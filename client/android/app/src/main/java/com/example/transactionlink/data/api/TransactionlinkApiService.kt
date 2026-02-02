package com.example.transactionlink.data.api

import com.example.transactionlink.data.models.WorkflowExecutionResponse
import com.example.transactionlink.data.models.WorkflowStatusResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

/**
 * Backend API service interface
 * All endpoints communicate with the backend server which handles API secrets securely
 */
interface BackendApiService {

    /**
     * Create a workflow execution and get widget token
     * The backend handles authentication and workflow creation
     */
    @POST("workflow-execution")
    suspend fun createWorkflowExecution(
        @Body parameters: Map<String, @JvmSuppressWildcards Any> = emptyMap()
    ): WorkflowExecutionResponse

    /**
     * Get workflow status by ID
     */
    @GET("workflow-status")
    suspend fun getWorkflowStatus(
        @Query("workflowId") workflowId: String
    ): WorkflowStatusResponse
}
