package org.gpp.milklab.config

import org.gpp.milklab.model.security.Role
import org.gpp.milklab.repository.security.UserRepository
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(
        val userRepository: UserRepository
): UserDetailsService {
    @Override
    override fun loadUserByUsername(username: String?): UserDetails {
        val user = username?.let { userRepository.findByUsername(it) }
                ?: throw UsernameNotFoundException("No user found with username $username")
        return User(
                user.username,
                user.password,
                mutableListOf()
        )
    }

    fun mapToAuthorities(roles: Set<Role>): List<GrantedAuthority> {
        return roles.map { role -> SimpleGrantedAuthority(role.value) }
    }
}