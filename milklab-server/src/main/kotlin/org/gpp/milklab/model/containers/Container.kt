package org.gpp.milklab.model.containers

import org.gpp.milklab.model.Analysis
import org.gpp.milklab.model.flock.Group
import javax.persistence.*

@Entity
class  Container (
        @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "container_sequence", initialValue = 100)
        var id: Long = -1,
        var number: Int? = null,
        var state: ContainerState? = ContainerState.STORED,
        @ManyToOne
        @JoinColumn(name = "group_id")
        var group: Group? = null,
        @OneToMany(mappedBy = "container")
        var analyses: List<Analysis>? = null,
        @ManyToMany(mappedBy = "containers")
        var movements: Set<Movement>? = null
)