package org.gpp.milklab.controler

import org.gpp.milklab.config.JWTUtils
import org.gpp.milklab.model.security.AuthData
import org.gpp.milklab.model.security.Session
import org.gpp.milklab.model.security.SigninPayload
import org.gpp.milklab.repository.security.SessionRepository
import org.gpp.milklab.repository.security.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
class LoginController(
        val userRepository: UserRepository,
        val sessionRepository: SessionRepository,
        val authenticationManager: AuthenticationManager,
        val jwtUtils: JWTUtils
) {
    @CrossOrigin(origins = ["http://localhost:8080", "http://localhost:5000"])
    @PostMapping(value = ["/api/login"])
    fun createAuthToken(@RequestBody payload: AuthData): ResponseEntity<SigninPayload?> {
        println("process request")
        val authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                        payload.username,
                        payload.password
                )
        )
        SecurityContextHolder.getContext().authentication = authentication
        val user = userRepository.findByUsername(payload.username)
                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        val token = jwtUtils.generateToken(user)
        val session = Session(
                user = user,
                date = LocalDateTime.now()
        )
        sessionRepository.save(session)
        return ResponseEntity.ok(SigninPayload(
                token = token,
                userId = user.id
        ))
    }
}