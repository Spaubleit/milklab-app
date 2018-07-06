package org.gpp.milklab.model.structure

class HouseholdInput (
    val id: Long = -1,
    val name: String? = "",
    val iban: String? = "",
    val userId: Long? = null,
//    val bankId: Long? = null,
    val districtId: Long? = null
)