package org.gpp.milklab.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
class SecurityConfiguration(
        val jwtUtils: JWTUtils,
        val userDetailsServiceImpl: UserDetailsServiceImpl
): WebSecurityConfigurerAdapter() {
    fun configureGlobal(auth: AuthenticationManagerBuilder) {
        auth
                .userDetailsService(userDetailsServiceImpl)
                .passwordEncoder(passwordEncoderBean())
    }

    @Bean
    fun passwordEncoderBean() = BCryptPasswordEncoder()

    @Bean
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }

    override fun configure(http: HttpSecurity?) {
        http
                ?.csrf()?.disable()
                ?.sessionManagement()?.sessionCreationPolicy(SessionCreationPolicy.STATELESS)?.and()
                ?.authorizeRequests()
                // Temporary permit
                ?.antMatchers("/graphql/**")?.permitAll()
                ?.antMatchers("/api/**/**")?.permitAll()
                ?.anyRequest()?.authenticated()
        // Custom JWT security filter
        val filter = AuthTokenFilter()
        http
                ?.addFilterBefore(filter, UsernamePasswordAuthenticationFilter::class.java)
        http
                ?.headers()
                ?.frameOptions()?.sameOrigin()?.cacheControl()
    }

    override fun configure(web: WebSecurity?) {
        web
                ?.ignoring()
                ?.antMatchers(HttpMethod.OPTIONS)
                ?.antMatchers("/graphql", "/graphiql")
                ?.and()
                ?.ignoring()
                ?.antMatchers(
                        HttpMethod.POST,
                        "/api/login"
                )

                // allow resource requests
                ?.and()
                ?.ignoring()
                ?.antMatchers(
                        HttpMethod.GET,
                        "/",
                        "/*.html",
                        "/*/*.css",
                        "/*/*.js"
                )
    }
}