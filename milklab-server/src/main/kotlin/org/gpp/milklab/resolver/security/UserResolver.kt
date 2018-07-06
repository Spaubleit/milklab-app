package org.gpp.milklab.resolver.security

import com.coxautodev.graphql.tools.GraphQLResolver
import org.gpp.milklab.model.security.User
import org.springframework.stereotype.Component

@Component
class UserResolver: GraphQLResolver<User>