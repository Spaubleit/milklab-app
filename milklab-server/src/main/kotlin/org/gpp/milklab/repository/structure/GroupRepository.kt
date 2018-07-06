package org.gpp.milklab.repository.structure

import org.gpp.milklab.model.flock.Group
import org.springframework.data.jpa.repository.JpaRepository

interface GroupRepository: JpaRepository<Group, Long> {
    fun findByFarmId(farmId: Long): Iterable<Group>
}