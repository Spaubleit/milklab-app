package org.gpp.milklab.model.security

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import org.gpp.milklab.config.CustomDeserializer
import java.time.LocalDateTime

class SessionInput (
        val id: Long = -1,
        @JsonSerialize(using = LocalDateTimeSerializer::class)
        @JsonDeserialize(using = CustomDeserializer::class)
        val date: LocalDateTime? = LocalDateTime.now(),
        val userId: Long? = null
)