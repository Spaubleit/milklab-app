package org.gpp.milklab.model.flock

class GroupInput (
        val id: Long = -1,
        val number: Int? = -1,
        val userId: Long? = null,
        val farmId: Long? = null,
        val cowsId: List<Long>? = null,
        val containersId: List<Long>? = null
)