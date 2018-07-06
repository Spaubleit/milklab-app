package org.gpp.milklab.model.structure

import org.gpp.milklab.model.security.User
import javax.persistence.*

@Entity
@DiscriminatorValue("region")
@PrimaryKeyJoinColumn(name = "id")
class Region(
        id: Long? = -1,
        name: String? = "",
        user: User? = null,
        @OneToMany(mappedBy = "region", cascade = [CascadeType.REMOVE], fetch = FetchType.EAGER, orphanRemoval = true)
        var districts: List<District>? = null
): Structure(id, name, user)