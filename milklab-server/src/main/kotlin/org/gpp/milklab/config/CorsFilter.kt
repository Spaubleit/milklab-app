package org.gpp.milklab.config

import org.springframework.stereotype.Component
import javax.servlet.*
import javax.servlet.http.HttpServletResponse

//@Component
class CorsFilter: Filter {
    override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain?) {
        val res = response as HttpServletResponse
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE, PATCH")
        res.setHeader("Access-Control-Max-Age", "3600")
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        res.setHeader("Access-Control-Expose-Headers", "Location")
        chain?.doFilter(request, response)
    }

    override fun init(filterConfig: FilterConfig?) {}

    override fun destroy() {}
}