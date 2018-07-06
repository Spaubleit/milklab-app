package org.gpp.milklab.model.security

import java.time.LocalDate
import java.util.*

class SessionByDate (
//        val id: Long
        val date: LocalDate?,
        val sessions: List<Session>
)