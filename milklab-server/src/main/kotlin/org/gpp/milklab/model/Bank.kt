package org.gpp.milklab.model

import org.gpp.milklab.model.structure.Household
import javax.persistence.*

@Entity
class Bank (
        @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "bank_sequence", initialValue = 100)
        var id: Long,
        var name: String,
        var adress: String,
        var iban: String,
        @OneToMany(mappedBy = "bank")
        var households: List<Household>
)