package org.gpp.milklab.model.flock

class CowInput (
        val id: Long = -1,
        val number: Int? = null,
        val nickname: String? = "",
        val groupId: Long? = null,
        val analysesId: List<Long>? = null
)