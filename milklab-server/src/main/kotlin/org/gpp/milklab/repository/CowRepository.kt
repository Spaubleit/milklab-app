package org.gpp.milklab.repository

import org.gpp.milklab.model.flock.Cow
import org.springframework.data.jpa.repository.JpaRepository

interface CowRepository: JpaRepository<Cow, Long> {
    fun findByGroupId(id: Long): Iterable<Cow>
}