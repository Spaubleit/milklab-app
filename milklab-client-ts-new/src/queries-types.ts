/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface AnalysisInput {
  id: string,
  fat?: number | null,
  cells?: number | null,
  urea?: number | null,
  lactose?: number | null,
  solids?: number | null,
  acidity?: number | null,
  protein?: number | null,
  citricAcid?: number | null,
  conductivity?: number | null,
  freezingPoint?: number | null,
  containerId: string,
  cowId?: string | null,
};

export enum ContainerState {
  LOST = "LOST",
  RECIVED = "RECIVED",
  SENDED = "SENDED",
  STORED = "STORED",
}


export interface ContainerInput {
  id: string,
  number?: number | null,
  state?: ContainerState | null,
  groupId?: string | null,
  analysesId?: Array< string | null > | null,
  movementsId?: Array< string | null > | null,
};

export interface CowInput {
  id: string,
  number?: number | null,
  nickname?: string | null,
  groupId: string,
  analysesId?: Array< string | null > | null,
};

export interface GroupInput {
  id: string,
  number?: number | null,
  userId?: string | null,
  farmId: string,
  cowsId?: Array< string | null > | null,
  containersId?: Array< string | null > | null,
};

export interface MovementInput {
  id: string,
  date?: string | null,
  type?: MovementType | null,
  containersId?: Array< string | null > | null,
};

export enum MovementType {
  INCOME = "INCOME",
  OUTCOME = "OUTCOME",
}


export interface PositionInput {
  id: string,
  name: string,
};

export interface DistrictInput {
  id: string,
  name: string,
  userId?: string | null,
  regionId: string,
};

export interface FarmInput {
  id: string,
  name: string,
  userId?: string | null,
  householdId: string,
};

export interface HouseholdInput {
  id: string,
  name: string,
  userId?: string | null,
  iban?: string | null,
  districtId: string,
};

export interface RegionInput {
  id: string,
  name: string,
  userId?: string | null,
};

export interface UserInput {
  id: string,
  username: string,
  firstname?: string | null,
  lastname?: string | null,
  middlename?: string | null,
  password?: string | null,
  email?: string | null,
  enabled?: boolean | null,
  positionId?: string | null,
  rolesId?: Array< string | null > | null,
};

export interface AnalysesQueryVariables {
  containerId: string,
};

export interface AnalysesQuery {
  analyses:  Array< {
    id: string,
    fat: number | null,
    cells: number | null,
    urea: number | null,
    lactose: number | null,
    solids: number | null,
    acidity: number | null,
    protein: number | null,
    citricAcid: number | null,
    conductivity: number | null,
    freezingPoint: number | null,
    container:  {
      id: string,
    } | null,
    cow:  {
      id: string,
    } | null,
  } | null >,
};

export interface AnalysisCreateMutationVariables {
  analysisInput: AnalysisInput,
};

export interface AnalysisCreateMutation {
  createAnalysis:  {
    id: string,
    fat: number | null,
    cells: number | null,
    urea: number | null,
    lactose: number | null,
    solids: number | null,
    acidity: number | null,
    protein: number | null,
    citricAcid: number | null,
    conductivity: number | null,
    freezingPoint: number | null,
    container:  {
      id: string,
    } | null,
    cow:  {
      id: string,
    } | null,
  } | null,
};

export interface ContainerByIdQueryVariables {
  containerId: string,
};

export interface ContainerByIdQuery {
  containerById:  {
    id: string,
    number: number | null,
    state: ContainerState | null,
    group:  {
      id: string,
      number: number | null,
      farm:  {
        id: string,
        name: string,
      } | null,
    } | null,
  } | null,
};

export interface ContainerUpdateMutationVariables {
  containerInput: ContainerInput,
};

export interface ContainerUpdateMutation {
  updateContainer:  {
    id: string,
    number: number | null,
    state: ContainerState | null,
    group:  {
      id: string,
      number: number | null,
      farm:  {
        id: string,
        name: string,
      } | null,
    } | null,
  } | null,
};

export interface ContainersCreateMutationVariables {
  count: number,
};

export interface ContainersCreateMutation {
  createContainers:  Array< {
    id: string,
    number: number | null,
    state: ContainerState | null,
    group:  {
      id: string,
      number: number | null,
      farm:  {
        id: string,
        name: string,
      } | null,
    } | null,
  } | null > | null,
};

export interface ContainersQueryVariables {
  state?: ContainerState | null,
};

export interface ContainersQuery {
  containers:  Array< {
    id: string,
    number: number | null,
    state: ContainerState | null,
    group:  {
      id: string,
      number: number | null,
      farm:  {
        id: string,
        name: string,
      } | null,
    } | null,
  } | null >,
};

export interface CowCreateMutationVariables {
  cowInput: CowInput,
};

export interface CowCreateMutation {
  createCow:  {
    id: string,
    number: number | null,
    nickname: string | null,
    group:  {
      id: string,
    } | null,
  } | null,
};

export interface CowRemoveMutationVariables {
  id: string,
};

export interface CowRemoveMutation {
  removeCow: string | null,
};

export interface CowUpdateMutationVariables {
  cowInput: CowInput,
};

export interface CowUpdateMutation {
  updateCow:  {
    id: string,
    number: number | null,
    nickname: string | null,
    group:  {
      id: string,
    } | null,
  } | null,
};

export interface CowsQueryVariables {
  groupId: string,
};

export interface CowsQuery {
  cows:  Array< {
    id: string,
    number: number | null,
    nickname: string | null,
    group:  {
      id: string,
    } | null,
  } | null >,
};

export interface GroupCreateMutationVariables {
  groupInput: GroupInput,
};

export interface GroupCreateMutation {
  createGroup:  {
    id: string,
    number: number | null,
    farm:  {
      id: string,
    } | null,
    user:  {
      id: string,
      username: string | null,
      firstname: string | null,
      lastname: string | null,
      middlename: string | null,
      email: string | null,
      enabled: boolean | null,
      position:  {
        id: string,
        name: string | null,
      } | null,
      roles:  Array< {
        id: string,
        name: string | null,
        value: string | null,
      } | null >,
    } | null,
  } | null,
};

export interface GroupRemoveMutationVariables {
  id: string,
};

export interface GroupRemoveMutation {
  removeGroup: string | null,
};

export interface GroupUpdateMutationVariables {
  groupInput: GroupInput,
};

export interface GroupUpdateMutation {
  updateGroup:  {
    id: string,
    number: number | null,
    farm:  {
      id: string,
    } | null,
    user:  {
      id: string,
      username: string | null,
      firstname: string | null,
      lastname: string | null,
      middlename: string | null,
      email: string | null,
      enabled: boolean | null,
      position:  {
        id: string,
        name: string | null,
      } | null,
      roles:  Array< {
        id: string,
        name: string | null,
        value: string | null,
      } | null >,
    } | null,
  } | null,
};

export interface GroupsQueryVariables {
  farmId: string,
};

export interface GroupsQuery {
  groups:  Array< {
    id: string,
    number: number | null,
    farm:  {
      id: string,
    } | null,
    user:  {
      id: string,
      username: string | null,
      firstname: string | null,
      lastname: string | null,
      middlename: string | null,
      email: string | null,
      enabled: boolean | null,
      position:  {
        id: string,
        name: string | null,
      } | null,
      roles:  Array< {
        id: string,
        name: string | null,
        value: string | null,
      } | null >,
    } | null,
  } | null >,
};

export interface MovementCreateMutationVariables {
  movementInput: MovementInput,
};

export interface MovementCreateMutation {
  createMovement:  {
    id: string,
    date: string | null,
    type: MovementType | null,
    containers:  Array< {
      id: string,
      number: number | null,
    } | null > | null,
  } | null,
};

export interface MovementUpdateMutationVariables {
  movementInput: MovementInput,
};

export interface MovementUpdateMutation {
  updateMovement:  {
    id: string,
    date: string | null,
    type: MovementType | null,
    containers:  Array< {
      id: string,
      number: number | null,
    } | null > | null,
  } | null,
};

export interface MovementsQuery {
  movements:  Array< {
    id: string,
    date: string | null,
    type: MovementType | null,
    containers:  Array< {
      id: string,
      number: number | null,
    } | null > | null,
  } | null >,
};

export interface PositionCreateMutationVariables {
  positionInput: PositionInput,
};

export interface PositionCreateMutation {
  createPosition:  {
    id: string,
    name: string | null,
  } | null,
};

export interface PositionRemoveMutationVariables {
  id: string,
};

export interface PositionRemoveMutation {
  removePosition: string | null,
};

export interface PositionUpdateMutationVariables {
  positionInput: PositionInput,
};

export interface PositionUpdateMutation {
  updatePosition:  {
    id: string,
    name: string | null,
  } | null,
};

export interface PositionsQuery {
  positions:  Array< {
    id: string,
    name: string | null,
  } | null >,
};

export interface RolesQuery {
  roles:  Array< {
    id: string,
    name: string | null,
    value: string | null,
  } | null >,
};

export interface SessionRemoveMutationVariables {
  id: string,
};

export interface SessionRemoveMutation {
  removeSession: string | null,
};

export interface SessionsByDateQuery {
  sessionsByDate:  Array< {
    // id: ID!
    date: string,
    sessions:  Array< {
      id: string,
      date: string,
      time: string | null,
      user:  {
        id: string,
        username: string | null,
      } | null,
    } | null >,
  } | null >,
};

export interface DistrictCreateMutationVariables {
  districtInput: DistrictInput,
};

export interface DistrictCreateMutation {
  createDistrict:  {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    region:  {
      id: string,
    } | null,
    households:  Array< {
      id: string,
      name: string,
      iban: string | null,
      user:  {
        id: string,
      } | null,
      // bank: Bank
      district:  {
        id: string,
      } | null,
      farms:  Array< {
        id: string,
        name: string,
        user:  {
          id: string,
        } | null,
        household:  {
          id: string,
        } | null,
      } | null > | null,
    } | null > | null,
  } | null,
};

export interface DistrictRemoveMutationVariables {
  id: string,
};

export interface DistrictRemoveMutation {
  removeDistrict: string | null,
};

export interface DistrictUpdateMutationVariables {
  districtInput: DistrictInput,
};

export interface DistrictUpdateMutation {
  updateDistrict:  {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    region:  {
      id: string,
    } | null,
    households:  Array< {
      id: string,
      name: string,
      iban: string | null,
      user:  {
        id: string,
      } | null,
      // bank: Bank
      district:  {
        id: string,
      } | null,
      farms:  Array< {
        id: string,
        name: string,
        user:  {
          id: string,
        } | null,
        household:  {
          id: string,
        } | null,
      } | null > | null,
    } | null > | null,
  } | null,
};

export interface FarmCreateMutationVariables {
  farmInput: FarmInput,
};

export interface FarmCreateMutation {
  createFarm:  {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    household:  {
      id: string,
    } | null,
  } | null,
};

export interface FarmRemoveMutationVariables {
  id: string,
};

export interface FarmRemoveMutation {
  removeFarm: string | null,
};

export interface FarmUpdateMutationVariables {
  farmInput: FarmInput,
};

export interface FarmUpdateMutation {
  updateFarm:  {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    household:  {
      id: string,
    } | null,
  } | null,
};

export interface FarmsQuery {
  farms:  Array< {
    id: string,
    name: string,
    household:  {
      id: string,
      name: string,
    } | null,
  } | null >,
};

export interface HouseholdCreateMutationVariables {
  householdInput: HouseholdInput,
};

export interface HouseholdCreateMutation {
  createHousehold:  {
    id: string,
    name: string,
    iban: string | null,
    user:  {
      id: string,
    } | null,
    // bank: Bank
    district:  {
      id: string,
    } | null,
    farms:  Array< {
      id: string,
      name: string,
      user:  {
        id: string,
      } | null,
      household:  {
        id: string,
      } | null,
    } | null > | null,
  } | null,
};

export interface HouseholdRemoveMutationVariables {
  id: string,
};

export interface HouseholdRemoveMutation {
  removeHousehold: string | null,
};

export interface HouseholdUpdateMutationVariables {
  householdInput: HouseholdInput,
};

export interface HouseholdUpdateMutation {
  updateHousehold:  {
    id: string,
    name: string,
    iban: string | null,
    user:  {
      id: string,
    } | null,
    // bank: Bank
    district:  {
      id: string,
    } | null,
    farms:  Array< {
      id: string,
      name: string,
      user:  {
        id: string,
      } | null,
      household:  {
        id: string,
      } | null,
    } | null > | null,
  } | null,
};

export interface RegionCreateMutationVariables {
  regionInput: RegionInput,
};

export interface RegionCreateMutation {
  createRegion:  {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    districts:  Array< {
      id: string,
      name: string,
      user:  {
        id: string,
      } | null,
      region:  {
        id: string,
      } | null,
      households:  Array< {
        id: string,
        name: string,
        iban: string | null,
        user:  {
          id: string,
        } | null,
        // bank: Bank
        district:  {
          id: string,
        } | null,
        farms:  Array< {
          id: string,
          name: string,
          user:  {
            id: string,
          } | null,
          household:  {
            id: string,
          } | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
  } | null,
};

export interface RegionRemoveMutationVariables {
  id: string,
};

export interface RegionRemoveMutation {
  removeRegion: string | null,
};

export interface RegionUpdateMutationVariables {
  regionInput: RegionInput,
};

export interface RegionUpdateMutation {
  updateRegion:  {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    districts:  Array< {
      id: string,
      name: string,
      user:  {
        id: string,
      } | null,
      region:  {
        id: string,
      } | null,
      households:  Array< {
        id: string,
        name: string,
        iban: string | null,
        user:  {
          id: string,
        } | null,
        // bank: Bank
        district:  {
          id: string,
        } | null,
        farms:  Array< {
          id: string,
          name: string,
          user:  {
            id: string,
          } | null,
          household:  {
            id: string,
          } | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
  } | null,
};

export interface RegionsQuery {
  regions:  Array< {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    districts:  Array< {
      id: string,
      name: string,
      user:  {
        id: string,
      } | null,
      region:  {
        id: string,
      } | null,
      households:  Array< {
        id: string,
        name: string,
        iban: string | null,
        user:  {
          id: string,
        } | null,
        // bank: Bank
        district:  {
          id: string,
        } | null,
        farms:  Array< {
          id: string,
          name: string,
          user:  {
            id: string,
          } | null,
          household:  {
            id: string,
          } | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
  } | null >,
};

export interface UserByIdQueryVariables {
  userId: string,
};

export interface UserByIdQuery {
  userById:  {
    id: string,
    username: string | null,
    firstname: string | null,
    lastname: string | null,
    middlename: string | null,
    email: string | null,
    enabled: boolean | null,
    position:  {
      id: string,
      name: string | null,
    } | null,
    roles:  Array< {
      id: string,
      name: string | null,
      value: string | null,
    } | null >,
  } | null,
};

export interface UserCreateMutationVariables {
  userInput: UserInput,
};

export interface UserCreateMutation {
  createUser:  {
    id: string,
    username: string | null,
    firstname: string | null,
    lastname: string | null,
    middlename: string | null,
    email: string | null,
    enabled: boolean | null,
    position:  {
      id: string,
      name: string | null,
    } | null,
    roles:  Array< {
      id: string,
      name: string | null,
      value: string | null,
    } | null >,
  } | null,
};

export interface UserRemoveMutationVariables {
  id: string,
};

export interface UserRemoveMutation {
  removeUser: string | null,
};

export interface UserUpdateMutationVariables {
  userInput: UserInput,
};

export interface UserUpdateMutation {
  updateUser:  {
    id: string,
    username: string | null,
    firstname: string | null,
    lastname: string | null,
    middlename: string | null,
    email: string | null,
    enabled: boolean | null,
    position:  {
      id: string,
      name: string | null,
    } | null,
    roles:  Array< {
      id: string,
      name: string | null,
      value: string | null,
    } | null >,
  } | null,
};

export interface UsersQuery {
  users:  Array< {
    id: string,
    username: string | null,
    firstname: string | null,
    lastname: string | null,
    middlename: string | null,
    email: string | null,
    enabled: boolean | null,
    position:  {
      id: string,
      name: string | null,
    } | null,
    roles:  Array< {
      id: string,
      name: string | null,
      value: string | null,
    } | null >,
  } | null >,
};

export interface analysisFragment {
  id: string,
  fat: number | null,
  cells: number | null,
  urea: number | null,
  lactose: number | null,
  solids: number | null,
  acidity: number | null,
  protein: number | null,
  citricAcid: number | null,
  conductivity: number | null,
  freezingPoint: number | null,
  container:  {
    id: string,
  } | null,
  cow:  {
    id: string,
  } | null,
};

export interface containerFragment {
  id: string,
  number: number | null,
  state: ContainerState | null,
  group:  {
    id: string,
    number: number | null,
    farm:  {
      id: string,
      name: string,
    } | null,
  } | null,
};

export interface cowFragment {
  id: string,
  number: number | null,
  nickname: string | null,
  group:  {
    id: string,
  } | null,
};

export interface groupFragment {
  id: string,
  number: number | null,
  farm:  {
    id: string,
  } | null,
  user:  {
    id: string,
    username: string | null,
    firstname: string | null,
    lastname: string | null,
    middlename: string | null,
    email: string | null,
    enabled: boolean | null,
    position:  {
      id: string,
      name: string | null,
    } | null,
    roles:  Array< {
      id: string,
      name: string | null,
      value: string | null,
    } | null >,
  } | null,
};

export interface groupUserFragment {
  id: string,
  username: string | null,
  firstname: string | null,
  lastname: string | null,
  middlename: string | null,
  email: string | null,
  enabled: boolean | null,
  position:  {
    id: string,
    name: string | null,
  } | null,
  roles:  Array< {
    id: string,
    name: string | null,
    value: string | null,
  } | null >,
};

export interface movementFragment {
  id: string,
  date: string | null,
  type: MovementType | null,
  containers:  Array< {
    id: string,
    number: number | null,
  } | null > | null,
};

export interface positionFragment {
  id: string,
  name: string | null,
};

export interface roleFragment {
  id: string,
  name: string | null,
  value: string | null,
};

export interface sessionByDateFragment {
  // id: ID!
  date: string,
  sessions:  Array< {
    id: string,
    date: string,
    time: string | null,
    user:  {
      id: string,
      username: string | null,
    } | null,
  } | null >,
};

export interface sessionFragment {
  id: string,
  date: string,
  time: string | null,
  user:  {
    id: string,
    username: string | null,
  } | null,
};

export interface districtFragment {
  id: string,
  name: string,
  user:  {
    id: string,
  } | null,
  region:  {
    id: string,
  } | null,
  households:  Array< {
    id: string,
    name: string,
    iban: string | null,
    user:  {
      id: string,
    } | null,
    // bank: Bank
    district:  {
      id: string,
    } | null,
    farms:  Array< {
      id: string,
      name: string,
      user:  {
        id: string,
      } | null,
      household:  {
        id: string,
      } | null,
    } | null > | null,
  } | null > | null,
};

export interface farmListItemFragment {
  id: string,
  name: string,
  household:  {
    id: string,
    name: string,
  } | null,
};

export interface farmFragment {
  id: string,
  name: string,
  user:  {
    id: string,
  } | null,
  household:  {
    id: string,
  } | null,
};

export interface householdFragment {
  id: string,
  name: string,
  iban: string | null,
  user:  {
    id: string,
  } | null,
  // bank: Bank
  district:  {
    id: string,
  } | null,
  farms:  Array< {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    household:  {
      id: string,
    } | null,
  } | null > | null,
};

export interface regionFragment {
  id: string,
  name: string,
  user:  {
    id: string,
  } | null,
  districts:  Array< {
    id: string,
    name: string,
    user:  {
      id: string,
    } | null,
    region:  {
      id: string,
    } | null,
    households:  Array< {
      id: string,
      name: string,
      iban: string | null,
      user:  {
        id: string,
      } | null,
      // bank: Bank
      district:  {
        id: string,
      } | null,
      farms:  Array< {
        id: string,
        name: string,
        user:  {
          id: string,
        } | null,
        household:  {
          id: string,
        } | null,
      } | null > | null,
    } | null > | null,
  } | null > | null,
};

export interface userFragment {
  id: string,
  username: string | null,
  firstname: string | null,
  lastname: string | null,
  middlename: string | null,
  email: string | null,
  enabled: boolean | null,
  position:  {
    id: string,
    name: string | null,
  } | null,
  roles:  Array< {
    id: string,
    name: string | null,
    value: string | null,
  } | null >,
};
