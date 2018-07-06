package org.gpp.milklab.repository.security

import org.gpp.milklab.model.security.Session
import org.springframework.data.jpa.repository.JpaRepository

interface SessionRepository: JpaRepository<Session, Long>