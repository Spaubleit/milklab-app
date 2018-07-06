package org.gpp.milklab.model.security

import javax.persistence.*

@Entity
data class Role(
        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "role_sequence", initialValue = 100)
        var id: Long = -1,
        var name: String = "",
        var value: String = "",
        @ManyToMany(mappedBy = "roles")
        var users: List<User> = mutableListOf()
)