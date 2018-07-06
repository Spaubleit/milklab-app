package org.gpp.milklab.resolver.root

import com.coxautodev.graphql.tools.GraphQLQueryResolver
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import org.gpp.milklab.model.Analysis
import org.gpp.milklab.model.containers.Container
import org.gpp.milklab.model.containers.Movement
import org.gpp.milklab.model.containers.ContainerState
import org.gpp.milklab.model.flock.Cow
import org.gpp.milklab.model.security.*
import org.gpp.milklab.model.structure.Farm
import org.gpp.milklab.model.flock.Group
import org.gpp.milklab.model.structure.Region
import org.gpp.milklab.repository.*
import org.gpp.milklab.repository.security.PositionRepository
import org.gpp.milklab.repository.security.RoleRepository
import org.gpp.milklab.repository.security.UserRepository
import org.gpp.milklab.repository.security.SessionRepository
import org.gpp.milklab.repository.structure.FarmRepository
import org.gpp.milklab.repository.structure.GroupRepository
import org.gpp.milklab.repository.structure.RegionRepository
import org.springframework.stereotype.Component
import java.text.SimpleDateFormat
import java.time.LocalDateTime

@Component
class Query (
        private val userRepository: UserRepository,
        private val positionRepository: PositionRepository,
        private val roleRepository: RoleRepository,
        private val groupRepository: GroupRepository,
        private val cowRepository: CowRepository,
        private val regionRepository: RegionRepository,
        private val farmRepository: FarmRepository,
        private val analysisRepository: AnalysisRepository,
        private val containerRepository: ContainerRepository,
        private val sessionRepository: SessionRepository,
        private val movementRepository: MovementRepository
)
    : GraphQLQueryResolver {
    // User
    fun users(): Iterable<User> = userRepository.findAll()
    fun userById(userId: Long) = userRepository.findById(userId)

    fun positions(): Iterable<Position> = positionRepository.findAll()
    fun roles(): Iterable<Role> = roleRepository.findAll()
    fun regions(): Iterable<Region> = regionRepository.findAll()
    fun farms(): Iterable<Farm> = farmRepository.findAll()
    fun groups(farmId: Long): Iterable<Group> {
        return groupRepository.findByFarmId(farmId)
    }
    fun cows(groupId: Long): Iterable<Cow> {
        return cowRepository.findByGroupId(groupId)
    }
    fun analyses(containerId: Long): Iterable<Analysis> {
        return analysisRepository.findByContainerId(containerId)
    }

    // Container
    fun containers(state: ContainerState?): Iterable<Container> {
        if (state == null)
            return containerRepository.findAll().sortedBy { x -> x.id }
        return containerRepository.findByState(state).sortedBy { x -> x.id }
    }

    fun containerById(containerId: Long) = containerRepository.findById(containerId)

    fun sessionsByDate(): Iterable<SessionByDate> {
        val result = sessionRepository.findAll().groupBy { x -> x.date?.toLocalDate() }
        return result.map { x -> SessionByDate(
                date = x.key,
                sessions = x.value
        ) }.sortedByDescending { x -> x.date }
    }

    fun movements(): Iterable<Movement> {
        return movementRepository.findAll().sortedByDescending { x -> x.date }
    }

    fun test():LocalDateTime {
//        val mapper = ObjectMapper()
//        mapper.findAndRegisterModules()
//        val time =  println(mapper.readValue("2018-06-20T08:20:25.066Z", LocalDateTime::class.java))

        return LocalDateTime.now()
    }

//    fun sessionsByUser(): Iterable<SessionByUser> {
//        val result = sessionRepository.findAll().groupBy { x -> x.user }
//        return result.map { x -> SessionByUser(
//                user = x.key,
//                sesnions = x.value
//        ) }
//    }
}