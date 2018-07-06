package org.gpp.milklab.model.containers

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import org.gpp.milklab.config.CustomDeserializer
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class MovementInput (
        val id: Long = -1,
        @JsonSerialize(using = LocalDateTimeSerializer::class)
//        @JsonDeserialize(using = LocalDateTimeDeserializer::class)
//        @DateTimeFormat(iso = DateTimeFormat.ISO)
//        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'z'")
        @JsonDeserialize(using = CustomDeserializer::class)
        var date: LocalDateTime? = LocalDateTime.now(),
        val type: MovementType? = MovementType.INCOME,
        val containersId: List<Long>? = null
)