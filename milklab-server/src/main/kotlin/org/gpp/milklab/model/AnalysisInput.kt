package org.gpp.milklab.model

class AnalysisInput (
        val id: Long = -1,
        val fat: Float? = null,
        val cells: Float? = null,
        val urea: Float? = null,
        val lactose: Float? = null,
        val solids: Float? = null,
        val acidity: Float? = null,
        val protein: Float? = null,
        val citricAcid: Float? = null,
        val conductivity: Float? = null,
        val freezingPoint: Float? = null,
        val containerId: Long? = null,
        val cowId: Long? = null
)