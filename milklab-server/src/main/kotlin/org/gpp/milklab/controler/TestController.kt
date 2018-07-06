package org.gpp.milklab.controler

import org.gpp.milklab.model.security.SessionInput
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {
    @PostMapping(value = ["/api/test"])
    fun test(@RequestBody sessionInput: SessionInput) {
        println(sessionInput.date)
    }
}