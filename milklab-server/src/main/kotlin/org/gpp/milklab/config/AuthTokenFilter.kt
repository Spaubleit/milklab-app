package org.gpp.milklab.config

import io.jsonwebtoken.ExpiredJwtException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@ConfigurationProperties(prefix = "config")
class AuthTokenFilter: OncePerRequestFilter() {
    @Autowired
    private lateinit var userDetailsService: UserDetailsService
    @Autowired
    private lateinit var jwtUtils: JWTUtils
//    @Value("\${config.header}")
    private var header: String = "Authorization"
    @Value("\${config.prefix}")
    private lateinit var prefix: String

    override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain) {
        val requestHeader = request.getHeader(header)

        var username: String? = null
        var token: String? = null
        if (requestHeader != null && requestHeader.startsWith(prefix)) {
            token = requestHeader.replace(prefix, "")
            try {
                username = jwtUtils.getUsernameFromToken(token)
            } catch (e: IllegalArgumentException) {
                logger.error("an error occured during getting username from token", e)
            } catch (e: ExpiredJwtException) {
                logger.warn("the token is expired and not valid anymore", e)
            }
        } else {
            logger.warn("couldn't find bearer string, will ignore the header")
        }

        logger.warn("checking authentication for user $username")
        if (username != null && SecurityContextHolder.getContext().authentication != null) {
            // It is not compelling necessary to load the use details from the database. You could also store the information
            // in the token and read it from it. It's up to you ;)
            val userDetails = userDetailsService.loadUserByUsername(username)

            // For simple validation it is completely sufficient to just check the token integrity. You don't have to call
            // the database compellingly. Again it's up to you ;)
            if (jwtUtils.validateToken(token, userDetails)) {
                val authentication = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                logger.info("authenticated user $username, setting security context")
                SecurityContextHolder.getContext().authentication = authentication
            }
        }

        filterChain.doFilter(request, response)
    }
}