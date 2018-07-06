package org.gpp.milklab.repository.security

import org.gpp.milklab.model.security.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Long> {
    fun findByUsername(username: String): User?
}