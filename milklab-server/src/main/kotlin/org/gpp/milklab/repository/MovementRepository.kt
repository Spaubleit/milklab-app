package org.gpp.milklab.repository

import org.gpp.milklab.model.containers.Movement
import org.gpp.milklab.model.containers.MovementType
import org.springframework.data.jpa.repository.JpaRepository

interface MovementRepository: JpaRepository<Movement, Long> {
    fun findByType(type: MovementType): Iterable<Movement>
}