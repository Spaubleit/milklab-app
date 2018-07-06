package org.gpp.milklab.repository.security

import org.gpp.milklab.model.security.Role
import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository: JpaRepository<Role, Long>