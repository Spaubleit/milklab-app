package org.gpp.milklab.model.structure

import org.gpp.milklab.model.security.User
import javax.persistence.*

@Entity
@DiscriminatorValue("district")
@PrimaryKeyJoinColumn(name = "id")
class District (
        id: Long? = -1,
        name: String? = "",
        user: User? = null,
        @ManyToOne
        @JoinColumn(name = "region_id")
        var region: Region? = null,
        @OneToMany(mappedBy = "district", cascade = [CascadeType.REMOVE], fetch = FetchType.EAGER, orphanRemoval = true)
        var households: List<Household>? = null
): Structure(id, name, user)