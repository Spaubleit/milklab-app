package org.gpp.milklab.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
//@ConfigurationProperties(prefix = "config")
//class ConfigurationConstants (
//    @Value("\${secret}")
//    val secret: String,
//    @Value("\${expiration}")
//    val expiration: Long,
//    @Value("\${prefix}")
//    val prefix: String,
//    @Value("\${Authorization}")
//    val header: String
//)

class ConfigurationConstants {
    val secret: String = "MilklabApplicationSecret"
    val expiration: Long = 24
    val prefix: String = "Bearer "
    val header: String = "Authorization"
}