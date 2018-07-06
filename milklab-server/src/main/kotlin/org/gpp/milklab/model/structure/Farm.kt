package org.gpp.milklab.model.structure

import org.gpp.milklab.model.flock.Group
import org.gpp.milklab.model.security.User
import javax.persistence.*

@Entity
@DiscriminatorValue("farm")
class Farm (
        id: Long? = -1,
        name: String? = "",
        user: User? = null,
        @ManyToOne
        @JoinColumn(name = "household_id")
        var household: Household? = null,
        @OneToMany(mappedBy = "farm", cascade = [CascadeType.REMOVE], fetch = FetchType.EAGER, orphanRemoval = true)
        var groups: List<Group>? = null
): Structure(id, name, user)