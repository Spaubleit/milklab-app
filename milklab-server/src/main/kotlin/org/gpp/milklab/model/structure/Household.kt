package org.gpp.milklab.model.structure

import org.gpp.milklab.model.Bank
import org.gpp.milklab.model.security.User
import javax.persistence.*

@Entity
@DiscriminatorValue("household")
class Household(
        id: Long? = -1,
        name: String? = "",
        user: User? = null,
        var iban: String? = "",
        @ManyToOne
        @JoinColumn(name = "bank_id")
        var bank: Bank? = null,
        @ManyToOne
        @JoinColumn(name = "district_id")
        var district: District? = null,
        @OneToMany(mappedBy = "household", cascade = [CascadeType.REMOVE], fetch = FetchType.EAGER, orphanRemoval = true)
        var farms: List<Farm>? = null
): Structure(id, name, user)