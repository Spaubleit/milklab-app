package org.gpp.milklab.repository

import org.gpp.milklab.model.containers.Container
import org.gpp.milklab.model.containers.ContainerState
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ContainerRepository: JpaRepository<Container, Long> {
    fun findByState(state: ContainerState): Iterable<Container>
    @Query("SELECT coalesce(max(c.number), 0) FROM Container c")
    fun maxNumber(): Int
}