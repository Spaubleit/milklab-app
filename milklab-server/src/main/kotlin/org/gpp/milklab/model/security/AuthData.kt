package org.gpp.milklab.model.security

import org.springframework.security.core.userdetails.UserDetails

class AuthData (
        val username: String = "",
        val password: String = ""
)