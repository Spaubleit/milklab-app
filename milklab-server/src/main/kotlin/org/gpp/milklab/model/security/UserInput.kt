package org.gpp.milklab.model.security

class UserInput (
    val id: Long = -1,
    val username: String? = "",
    val firstname: String? = "",
    val lastname: String? = "",
    val middlename: String? = "",
    val password: String? = "",
    val email: String? = "",
    val enabled: Boolean? = false,
    val positionId: Long? = -1,
    val rolesId: List<Long>? = mutableListOf()
)