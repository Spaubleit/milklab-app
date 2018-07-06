package org.gpp.milklab.config

import org.gpp.milklab.repository.AnalysisRepository
import org.gpp.milklab.repository.ContainerRepository
import org.gpp.milklab.repository.CowRepository
import org.gpp.milklab.repository.MovementRepository
import org.gpp.milklab.repository.security.PositionRepository
import org.gpp.milklab.repository.security.RoleRepository
import org.gpp.milklab.repository.security.SessionRepository
import org.gpp.milklab.repository.security.UserRepository
import org.gpp.milklab.repository.structure.*
import org.gpp.milklab.resolver.root.Mutation
import org.gpp.milklab.resolver.root.Query
import org.gpp.milklab.resolver.security.PositionResolver
import org.gpp.milklab.resolver.security.RoleResolver
import org.gpp.milklab.resolver.security.UserResolver
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Configuration
class GraphQLConfiguration {
    //root resolvers
    @Bean
    fun mutation(
            userRepository: UserRepository,
            positionRepository: PositionRepository,
            roleRepository: RoleRepository,
            regionRepository: RegionRepository,
            districtRepository: DistrictRepository,
            householdRepository: HouseholdRepository,
            farmRepository: FarmRepository,
            groupRepository: GroupRepository,
            containerRepository: ContainerRepository,
            cowRepository: CowRepository,
            movementRepository: MovementRepository,
            sessionRepository: SessionRepository,
            analysisRepository: AnalysisRepository,
            bCryptPasswordEncoder: BCryptPasswordEncoder
    ): Mutation {
        return Mutation(
                userRepository,
                positionRepository,
                roleRepository,
                regionRepository,
                districtRepository,
                householdRepository,
                farmRepository,
                groupRepository,
                containerRepository,
                cowRepository,
                movementRepository,
                analysisRepository,
                sessionRepository,
                bCryptPasswordEncoder)
    }
    @Bean
    fun query(
            userRepository: UserRepository,
            positionRepository: PositionRepository,
            roleRepository: RoleRepository,
            groupRepository: GroupRepository,
            cowRepository: CowRepository,
            regionRepository: RegionRepository,
            analysisRepository: AnalysisRepository,
            farmRepository: FarmRepository,
            containerRepository: ContainerRepository,
            sessionRepository: SessionRepository,
            movementRepository: MovementRepository
    ): Query {
        return Query(
                userRepository,
                positionRepository,
                roleRepository,
                groupRepository,
                cowRepository,
                regionRepository,
                farmRepository,
                analysisRepository,
                containerRepository,
                sessionRepository,
                movementRepository)
    }

    //data classes resolvers
    @Bean
    fun positionResolver(): PositionResolver {
        return PositionResolver()
    }
    @Bean
    fun releResolver(): RoleResolver {
        return RoleResolver()
    }
    @Bean
    fun userResolver(): UserResolver {
        return UserResolver()
    }
}