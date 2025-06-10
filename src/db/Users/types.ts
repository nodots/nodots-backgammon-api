export type Preference = { key: string; value: string | object }

export type GamePreferences = {
  game: string
  preferences: Preference[]
}

export type UserPreferences = {
  username?: string
  gender?: string
  imageUri?: string
  games?: GamePreferences[]
}

export type ExternalUser = {
  token: string
  externalId: string
  email: string
  firstName?: string
  lastName?: string
  imageUri?: string
  preferences?: UserPreferences
}
