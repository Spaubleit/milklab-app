package org.gpp.milklab.model.security

import javax.persistence.*

@Entity
data class Position (
        @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "position_sequence", initialValue = 100)
        var id: Long = -1,
        var name: String = "",
        @OneToMany(mappedBy = "position", fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
        var users: List<User> = mutableListOf()
)