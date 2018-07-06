package org.gpp.milklab.repository.security

import org.gpp.milklab.model.security.Position
import org.springframework.data.jpa.repository.JpaRepository

interface PositionRepository: JpaRepository<Position, Long>