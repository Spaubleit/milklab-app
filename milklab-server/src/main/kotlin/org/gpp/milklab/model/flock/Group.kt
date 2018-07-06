package org.gpp.milklab.model.flock

import org.gpp.milklab.model.containers.Container
import org.gpp.milklab.model.security.User
import org.gpp.milklab.model.structure.Farm
import javax.persistence.*

@Entity
@Table(name = "\"group\"")
class Group (
        @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "group_sequence", initialValue = 100)
        var id: Long? = -1,
        @ManyToOne
        @JoinColumn(name = "user_id")
        var user: User? = null,
        var number: Int? = null,
        @ManyToOne
        @JoinColumn(name = "farm_id")
        var farm: Farm? = null,
        @OneToMany(mappedBy = "group", fetch = FetchType.EAGER, cascade = [CascadeType.REMOVE])
        var cows: List<Cow>? = null,
        @OneToMany(mappedBy = "group")//, fetch = FetchType.EAGER)
        var containers: List<Container>? = null
)