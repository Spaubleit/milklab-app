package org.gpp.milklab.model.containers

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime
import javax.persistence.*
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.format.annotation.DateTimeFormat
import java.time.format.DateTimeFormatter

@Entity
class Movement (
        @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequence-generator")
        @SequenceGenerator(name = "sequence-generator", sequenceName = "movement_sequence", initialValue = 100)
        var id: Long = -1,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        var date: LocalDateTime? = LocalDateTime.now(),
        var type: MovementType? = MovementType.INCOME,
        @ManyToMany(fetch = FetchType.EAGER) @JoinTable(
                joinColumns = [JoinColumn(name = "container_id", referencedColumnName = "id")],
                inverseJoinColumns = [JoinColumn(name = "movement_id", referencedColumnName = "id")])
        var containers: List<Container>? = null
)

