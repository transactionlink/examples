package com.example.transactionlink.data.models

import com.google.gson.annotations.SerializedName

data class AuthRequest(
    @SerializedName("key")
    val key: String,
    @SerializedName("secret")
    val secret: String
)

data class AuthResponse(
    @SerializedName("accessToken")
    val accessToken: String,
    @SerializedName("refreshToken")
    val refreshToken: String,
    @SerializedName("expiryDuration")
    val expiryDuration: Int,
    @SerializedName("tokenType")
    val tokenType: String
)
