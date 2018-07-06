package org.gpp.milklab.model.security

import java.time.*
import javax.persistence.*

@Entity
class Session (
        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "session_sequence", initialValue = 100)
        var id: Long = -1,
        var date: LocalDateTime? = LocalDateTime.now(),
        @ManyToOne
        @JoinColumn(name = "user_id")
        var user: User? = null
) {
        fun time(): LocalTime? = date?.toLocalTime()
}