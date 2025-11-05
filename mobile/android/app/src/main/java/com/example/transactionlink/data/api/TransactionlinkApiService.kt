package com.example.transactionlink.data.api

import com.example.transactionlink.data.models.AuthRequest
import com.example.transactionlink.data.models.AuthResponse
import com.example.transactionlink.data.models.WorkflowRequest
import com.example.transactionlink.data.models.WorkflowResponse
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface TransactionlinkApiService {

    @POST("auth/authorize")
    suspend fun authorize(
        @Body authRequest: AuthRequest
    ): AuthResponse

    @POST("workflows")
    suspend fun runWorkflow(
        @Header("Authorization") authorization: String,
        @Body workflowRequest: WorkflowRequest
    ): WorkflowResponse
}
