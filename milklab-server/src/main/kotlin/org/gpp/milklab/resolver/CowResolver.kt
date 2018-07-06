package org.gpp.milklab.resolver

import com.coxautodev.graphql.tools.GraphQLResolver
import org.gpp.milklab.model.flock.Cow
import org.springframework.stereotype.Component

@Component
class CowResolver: GraphQLResolver<Cow>