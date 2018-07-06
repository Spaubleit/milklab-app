package org.gpp.milklab.model.flock

import org.gpp.milklab.model.Analysis
import javax.persistence.*

@Entity
class Cow (
        @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "cow_sequence", initialValue = 100)
        var id: Long = -1,
        var number: Int? = null,
        var nickname: String? = "",
        @ManyToOne
        @JoinColumn(name = "group_id")
        var group: Group? = null,
        @OneToMany(mappedBy = "cow")
        var analyses: List<Analysis>? = null
)