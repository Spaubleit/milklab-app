package org.gpp.milklab.model.containers

class ContainerInput (
        val id: Long = -1,
        val number: Int? = null,
        val state: ContainerState? = ContainerState.STORED,
        val groupId: Long? = null,
        val analysesId: List<Long>? = null,
        val movementsId: List<Long>? = null
)