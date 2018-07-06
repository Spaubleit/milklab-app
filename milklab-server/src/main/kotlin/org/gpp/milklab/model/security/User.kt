package org.gpp.milklab.model.security

import javax.persistence.*

@Entity
@Table(name = "\"user\"")
class User(
        @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "user_sequence", initialValue = 100)
        var id: Long = -1,
        username: String? = "",
        firstname: String? = "",
        lastname: String? = "",
        middlename: String? = "",
        email: String? = "",
        password: String? = "",
        enabled: Boolean? = false,
        @ManyToOne @JoinColumn(name = "position_id")
        var position: Position? = null,
        @OneToMany(mappedBy = "user")
        var sessions: List<Session>? = null,
        @ManyToMany(fetch = FetchType.EAGER) @JoinTable(
            joinColumns = [JoinColumn(name = "role_id", referencedColumnName = "id")],
            inverseJoinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")])
        var roles: Set<Role>? = null
) {
    var username: String? = username
        set(value) {
            field = value ?: ""
        }
    var firstname: String? = firstname
        set(value) {
            field = value?: ""
        }
    var lastname: String? = lastname
        set(value) {
            field = value?: ""
        }
    var middlename: String? = middlename
        set(value) {
            field = value?: ""
        }
    var email: String? = email
        set(value) {
            field = value?: ""
        }
    var password: String? = ""
        set(value) {
            field = value?: ""
        }
    var enabled: Boolean ? = enabled
        set(value) {
            field = value?: false
        }
}