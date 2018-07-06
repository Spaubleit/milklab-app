package org.gpp.milklab.repository

import org.gpp.milklab.model.Analysis
import org.springframework.data.jpa.repository.JpaRepository

interface AnalysisRepository: JpaRepository<Analysis, Long> {
    fun findByContainerId(containerId: Long): Iterable<Analysis>
}