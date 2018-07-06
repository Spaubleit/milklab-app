package org.gpp.milklab.resolver.root

import com.coxautodev.graphql.tools.GraphQLMutationResolver
import org.gpp.milklab.kt
import org.gpp.milklab.model.*
import org.gpp.milklab.model.containers.*
import org.gpp.milklab.model.flock.Cow
import org.gpp.milklab.model.flock.CowInput
import org.gpp.milklab.model.flock.Group
import org.gpp.milklab.model.flock.GroupInput
import org.gpp.milklab.model.security.*
import org.gpp.milklab.model.structure.*
import org.gpp.milklab.repository.AnalysisRepository
import org.gpp.milklab.repository.ContainerRepository
import org.gpp.milklab.repository.CowRepository
import org.gpp.milklab.repository.MovementRepository
import org.gpp.milklab.repository.security.*
import org.gpp.milklab.repository.structure.*
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

class Mutation (
        private val userRepository: UserRepository,
        private val positionRepository: PositionRepository,
        private val roleRepository: RoleRepository,
        private val regionRepository: RegionRepository,
        private val districtRepository: DistrictRepository,
        private val householdRepository: HouseholdRepository,
        private val farmRepository: FarmRepository,
        private val groupRepository: GroupRepository,
        private val containerRepository: ContainerRepository,
        private val cowRepository: CowRepository,
        private val movementRepository: MovementRepository,
        private val analysisRepository: AnalysisRepository,
        private val sessionRepository: SessionRepository,
        private val bCryptPasswordEncoder: BCryptPasswordEncoder
) : GraphQLMutationResolver {
    // User
    fun createUser(userInput: UserInput): User {
        val user = User(
                username = userInput.username,
                firstname = userInput.firstname,
                lastname = userInput.lastname,
                middlename = userInput.middlename,
                password = bCryptPasswordEncoder.encode(userInput.password),
                email = userInput.email,
                enabled = userInput.enabled,
                position = userInput.positionId?.let { positionRepository.findById(userInput.positionId).kt() },
                roles = userInput.rolesId?.mapNotNull { id -> roleRepository.findById(id).kt() }?.toSet()
        )
        return userRepository.save(user)
    }

    fun updateUser(userInput: UserInput): User {
        val user = userRepository.getOne(userInput.id)
        userInput.username?.let { user.username = userInput.username }
        userInput.firstname?.let { user.firstname = userInput.firstname }
        userInput.lastname?.let { user.lastname = userInput.lastname }
        userInput.middlename?.let { user.middlename = userInput.middlename }
        userInput.password?.let { user.password = bCryptPasswordEncoder.encode(userInput.password) }
        userInput.email?.let { user.email = userInput.email }
        userInput.enabled?.let { user.enabled = userInput.enabled }
        userInput.positionId?.let { user.position = positionRepository.findById(userInput.positionId).kt() }
        userInput.rolesId?.let { user.roles = userInput.rolesId.mapNotNull { id -> roleRepository.findById(id).kt() }.toSet() }
        return userRepository.save(user)
    }

    fun removeUser(id: Long): Long {
        if (!(userRepository.existsById(id)))
            return 0
        userRepository.deleteById(id)
        return id
    }

    // Position
    fun createPosition(positionInput: PositionInput): Position {
        val position = Position(name = positionInput.name)
        return positionRepository.save(position)
    }

    fun updatePosition(positionInput: PositionInput): Position {
        val position = positionRepository.getOne(positionInput.id)
        position.name = positionInput.name
        return positionRepository.save(position)
    }

    fun removePosition(id: Long): Long {
        if (!(positionRepository.existsById(id)))
            return 0
        positionRepository.deleteById(id)
        return id
    }

    // Region
    fun createRegion(regionInput: RegionInput): Region {
        val region = Region(
                name = regionInput.name,
                user = regionInput.userId?.let { userRepository.findById(regionInput.userId).kt() }
        )
        return regionRepository.save(region)
    }

    fun updateRegion(regionInput: RegionInput): Region {
        val region = regionRepository.getOne(regionInput.id)
        regionInput.name?.let { region.name = regionInput.name }
        regionInput.userId?.let { region.user = userRepository.findById(regionInput.userId).kt() }
        return regionRepository.save(region)
    }

    fun removeRegion(id: Long): Long {
        if (!(regionRepository.existsById(id)))
            return 0
        regionRepository.deleteById(id)
        return id
    }

    // District
    fun createDistrict(districtInput: DistrictInput): District {
        val district = District(
                name = districtInput.name,
                user = districtInput.userId?.let { userRepository.findById(districtInput.userId).kt() },
                region = districtInput.regionId?.let { regionRepository.findById(districtInput.regionId).kt() }
        )
        return districtRepository.save(district)
    }

    fun updateDistrict(districtInput: DistrictInput): District {
        val district = districtRepository.getOne(districtInput.id)
        districtInput.name?.let { district.name = districtInput.name }
        districtInput.userId?.let { district.user = userRepository.findById(districtInput.userId).kt() }
        districtInput.regionId?.let { district.region = regionRepository.findById(districtInput.regionId).kt() }
        return districtRepository.save(district)
    }

    fun removeDistrict(id: Long): Long {
        if (!(districtRepository.existsById(id)))
            return 0
        districtRepository.deleteById(id)
        return id
    }

    // Household
    fun createHousehold(householdInput: HouseholdInput): Household {
        val household = Household(
                name = householdInput.name,
                iban = householdInput.iban,
                user = householdInput.userId?.let { userRepository.findById(householdInput.userId).get() },
                district = householdInput.districtId?.let { districtRepository.findById(householdInput.districtId).get() }
        )
        return householdRepository.save(household)
    }

    fun updateHousehold(householdInput: HouseholdInput): Household {
        val household = householdRepository.findById(householdInput.id).get()
        householdInput.name?.let { household.name = householdInput.name }
        householdInput.iban?.let { household.iban = householdInput.iban }
        householdInput.userId?.let { household.user = userRepository.findById(householdInput.userId).get() }
        householdInput.districtId?.let { household.district = districtRepository.findById(householdInput.districtId).get() }
        return householdRepository.save(household)
    }

    fun removeHousehold(id: Long): Long {
        if (!(householdRepository.existsById(id)))
            return 0
        householdRepository.deleteById(id)
        return id
    }

    // Farm
    fun createFarm(farmInput: FarmInput): Farm {
        val farm = Farm(
                name = farmInput.name,
                user = farmInput.userId?.let { userRepository.findById(farmInput.userId).kt() },
                household = farmInput.householdId?.let { householdRepository.findById(farmInput.householdId).kt() }
        )
        return farmRepository.save(farm)
    }

    fun updateFarm(farmInput: FarmInput): Farm {
        val farm = farmRepository.getOne(farmInput.id)
        farmInput.name?.let { farm.name = farmInput.name }
        farmInput.userId?.let { farm.user = userRepository.findById(farmInput.userId).kt() }
        farmInput.householdId?.let { farm.household = householdRepository.findById(farmInput.householdId).kt() }
        return farmRepository.save(farm)
    }

    fun removeFarm(id: Long): Long {
        if (!(farmRepository.existsById(id)))
            return 0
        farmRepository.deleteById(id)
        return id
    }

    // Group
    fun createGroup(groupInput: GroupInput): Group {
        println(groupInput.id)
        val group = Group(
                number = groupInput.number,
                user = groupInput.userId?.let { userRepository.findById(it).kt() },
                farm = groupInput.farmId?.let { farmRepository.findById(it).kt() },
                containers = groupInput.containersId?.mapNotNull { id -> containerRepository.findById(id).kt() },
                cows = groupInput.cowsId?.mapNotNull { id -> cowRepository.findById(id).kt() }
        )
        return groupRepository.save(group)
    }

    fun updateGroup(groupInput: GroupInput): Group {
        val group = groupRepository.getOne(groupInput.id)
        group.number = groupInput.number?.let { it }
        group.user = groupInput.userId?.let { userRepository.findById(it).kt() }
        group.farm = groupInput.farmId?.let { farmRepository.findById(it).kt() }
        group.containers = groupInput.containersId?.mapNotNull { id -> containerRepository.findById(id).kt() }
        group.cows = groupInput.cowsId?.mapNotNull { id -> cowRepository.findById(id).kt() }
        return groupRepository.save(group)
    }

    fun removeGroup(id: Long): Long {
        if (!(groupRepository.existsById(id)))
            return 0
        groupRepository.deleteById(id)
        return id
    }

    // Cow
    fun createCow(cowInput: CowInput): Cow {
        val cow = Cow(
                number = cowInput.number,
                nickname = cowInput.nickname,
                group = cowInput.groupId?.let { groupRepository.findById(it).kt() },
                analyses = cowInput.analysesId?.mapNotNull { id -> analysisRepository.findById(id).kt() }
        )
        return cowRepository.save(cow)
    }

    fun updateCow(cowInput: CowInput): Cow {
        val cow = cowRepository.getOne(cowInput.id)
        cow.number = cowInput.number?.let { it }
        cow.nickname = cowInput.nickname?.let { it }
        cow.group = cowInput.groupId?.let { groupRepository.findById(it).kt() }
        cow.analyses = cowInput.analysesId?.mapNotNull { id -> analysisRepository.findById(id).kt() }
        return cowRepository.save(cow)
    }

    fun removeCow(id: Long): Long {
        if (!cowRepository.existsById(id))
            return 0
        cowRepository.deleteById(id)
        return id
    }

    // Movement
    fun createMovement(movementInput: MovementInput): Movement {
        val movement = Movement(
                date = movementInput.date?.let { it },
                type = movementInput.type?.let { it }
        )
        val containers = movementInput.containersId?.mapNotNull { id -> containerRepository.findById(id).kt() }
        if (containers != null) {
            for (container in containers)
                container.state = if (movementInput.type == MovementType.INCOME) ContainerState.RECIVED else ContainerState.SENDED
            movement.containers = containerRepository.saveAll(containers)
        }
        return movementRepository.save(movement)
    }

    fun updateMovement(movementInput: MovementInput): Movement {
        val movement = movementRepository.getOne(movementInput.id)
        movement.date = movementInput.date?.let { it }
        movement.type = movementInput.type?.let { it }
        val containers = movementInput.containersId?.mapNotNull { id -> containerRepository.findById(id).kt() }
        if (containers != null) {
            for (container in containers)
                container.state = if (movementInput.type == MovementType.INCOME) ContainerState.RECIVED else ContainerState.SENDED
        }
        return movementRepository.save(movement)
    }

    fun removeMovement(id: Long): Long {
        if (!movementRepository.existsById(id))
            return 0
        movementRepository.deleteById(id)
        return id
    }

    // Analysis
    fun createAnalysis(analysisInput: AnalysisInput): Analysis {
        val analysis = Analysis(
                fat = analysisInput.fat,
                cells = analysisInput.cells,
                urea = analysisInput.urea,
                lactose = analysisInput.lactose,
                solids = analysisInput.solids,
                acidity = analysisInput.acidity,
                protein = analysisInput.protein,
                citricAcid = analysisInput.citricAcid,
                conductivity = analysisInput.conductivity,
                freezingPoint = analysisInput.freezingPoint,
                container = analysisInput.containerId?.let { containerRepository.findById(it).kt() },
                cow = analysisInput.cowId?.let { cowRepository.findById(it).kt() }
        )
        return analysisRepository.save(analysis)
    }

    fun updateAnalysis(analysisInput: AnalysisInput): Analysis {
        val analysis = analysisRepository.getOne(analysisInput.id)
        analysis.fat = analysisInput.fat?.let { it }
        analysis.cells = analysisInput.cells?.let { it }
        analysis.urea = analysisInput.urea?.let { it }
        analysis.lactose = analysisInput.lactose?.let { it }
        analysis.solids = analysisInput.solids?.let { it }
        analysis.acidity = analysisInput.acidity?.let { it }
        analysis.protein = analysisInput.protein?.let { it }
        analysis.citricAcid = analysisInput.citricAcid?.let { it }
        analysis.conductivity = analysisInput.conductivity?.let { it }
        analysis.freezingPoint = analysisInput.freezingPoint?.let { it }
        analysis.container = analysisInput.containerId?.let { containerRepository.findById(it).kt() }
        analysis.cow = analysisInput.cowId?.let { cowRepository.findById(it).kt() }
        return analysisRepository.save(analysis)
    }

    fun removeAnalysis(id: Long): Long {
        if (!analysisRepository.existsById(id))
            return 0
        analysisRepository.deleteById(id)
        return id
    }

    // Container
    fun createContainers(count: Int): Iterable<Container> {
        val minNumber = containerRepository.maxNumber() + 1
        val containers = mutableListOf<Container>()
        for (number in minNumber until minNumber + count) {
            containers.add(Container(
                    number = number
            ))
        }
        return containerRepository.saveAll(containers)
    }

    fun createContainer(containerInput: ContainerInput): Container {
        val container = Container(
                number = containerInput.number,
                state = containerInput.state?.let { it },
                group = containerInput.groupId?.let { groupRepository.findById(it).kt() },
                analyses = containerInput.analysesId?.mapNotNull { id -> analysisRepository.findById(id).kt() }
        )
        return containerRepository.save(container)
    }

    fun updateContainer(containerInput: ContainerInput): Container {
        val container = containerRepository.getOne(containerInput.id)
        containerInput.number?.let { container.number = it }
        container.state = containerInput.state?.let { it }
        container.group = containerInput.groupId?.let { groupRepository.findById(it).kt() }
        return containerRepository.save(container)
    }

    fun removeContainer(id: Long): Long {
        if (!containerRepository.existsById(id))
            return 0
        containerRepository.deleteById(id)
        return id
    }

    // Session
    fun removeSession(id: Long): Long {
        if (!sessionRepository.existsById(id))
            return 0
        sessionRepository.deleteById(id)
        return id
    }

    fun createSession(sessionInput: SessionInput): Session {
        val session = Session(
                date = sessionInput.date?.let { it },
                user = sessionInput.userId?.let { userRepository.findById(it).kt() }
        )
        return sessionRepository.save(session)
    }
}