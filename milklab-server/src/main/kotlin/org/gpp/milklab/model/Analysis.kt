package org.gpp.milklab.model

import org.gpp.milklab.model.containers.Container
import org.gpp.milklab.model.flock.Cow
import javax.persistence.*

@Entity
class Analysis (
        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "analysis_sequence", initialValue = 100)
        var id: Long = -1,
        var fat: Float? = null,
        var cells: Float? = null,
        var urea: Float? = null,
        var lactose: Float? = null,
        var solids: Float? = null,
        var acidity: Float? = null,
        var protein: Float? = null,
        var citricAcid: Float? = null,
        var conductivity: Float? = null,
        var freezingPoint: Float? = null,
        @ManyToOne
        @JoinColumn(name = "container_id")
        var container: Container? = null,
        @ManyToOne
        @JoinColumn(name = "cow_id")
        var cow: Cow? = null
)