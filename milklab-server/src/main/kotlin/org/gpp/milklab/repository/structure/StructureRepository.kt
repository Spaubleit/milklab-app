package org.gpp.milklab.repository.structure

import org.gpp.milklab.model.structure.Structure
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.CrudRepository

interface StructureRepository<T: Structure>: JpaRepository<T, Long> {
    override fun <S : T> save(entity: S): S
//    override fun delete(id: Long?)
}