package org.gpp.milklab.config

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.gpp.milklab.model.security.User
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*

@Component
//@ConfigurationProperties(prefix = "config")
class JWTUtils (
    @Value("\${config.secret}")
    val secret: String,
    @Value("\${config.expiration}")
    val expiration: Long
) {
    fun generateToken(user: User): String {
        val creation = Date()
        val expiration = calculateExpirationDate(Date())
        val token = Jwts.builder()
                ?.setSubject(user.username)
                ?.setIssuedAt(creation)
                ?.setExpiration(expiration)
                ?.signWith(SignatureAlgorithm.HS512, secret)
                ?.compact()
        return token ?: ""
    }

    fun refreshToken(token: String): String? {
        val creation = Date()
        val expiration = calculateExpirationDate(Date())
        val claims = getAllClaimsFromToken(token)
        return Jwts.builder()
                ?.setClaims(claims)
                ?.setIssuedAt(creation)
                ?.setExpiration(expiration)
                ?.compact()
    }

    fun isTokenExpired(token: String?): Boolean? {
        val expiration = getAllClaimsFromToken(token)?.expiration
        return expiration?.before(Date())
    }

    fun getUsernameFromToken(token: String?): String? {
        return getAllClaimsFromToken(token)?.subject
    }

    fun validateToken(token: String?, user: UserDetails?): Boolean {
        val username = getUsernameFromToken(token)
        return username == user?.username && isTokenExpired(token) ?: false
    }

    fun calculateExpirationDate(createdDate: Date): Date {
        return Date(createdDate.time + expiration * 1000)
    }

    fun getAllClaimsFromToken(token: String?): Claims? {
        return Jwts.parser()
                ?.setSigningKey(secret)
                ?.parseClaimsJws(token)
                ?.body
    }
}