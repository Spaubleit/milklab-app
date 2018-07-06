package org.gpp.milklab.config

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod

@Controller
class RedirectController {
    // Redirect all not root request to index.html
    @RequestMapping(value = ["{path:[^\\.]*}"], method = [RequestMethod.GET])
    fun home(): Any {
        return "forward:/index.html"
    }
}