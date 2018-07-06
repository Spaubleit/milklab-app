package org.gpp.milklab.model.structure

import org.gpp.milklab.model.security.User
import javax.persistence.*

@Entity
@DiscriminatorColumn(name = "type")
@Inheritance(strategy = InheritanceType.JOINED)
abstract class Structure(
        @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "structure_sequence", initialValue = 100)
        var id: Long? = -1,
        var name: String? = "",
        @ManyToOne
        @JoinColumn(name = "user_id")
        var user: User? = null
)