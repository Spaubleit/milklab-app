package org.gpp.milklab

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.util.*

@SpringBootApplication
class MilklabApplication

fun main(args: Array<String>) {
    runApplication<MilklabApplication>(*args)
}

fun <T> Optional<T>.kt(): T? = orElse(null)
