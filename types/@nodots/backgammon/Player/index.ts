import { NodotsColor, NodotsMoveDirection } from '../../..'

export type NodotsLocale = 'en' | 'es'

export interface INodotsPlayerPreferences {
  username: string
  color: NodotsColor
  direction: NodotsMoveDirection
  automation: {
    roll: boolean
    move: boolean
  }
}

export type INodotsPlayer = {
  externalId: string
  email: string
  locale: NodotsLocale
  preferences?: INodotsPlayerPreferences
}

export interface INodotsPlayers {
  black: INodotsPlayer
  white: INodotsPlayer
}

export interface PlayerIncoming extends INodotsPlayer {
  kind: 'player-incoming'
  preferences: INodotsPlayerPreferences
}

export interface PlayerWaiting extends INodotsPlayer {
  kind: 'player-waiting'
}

export interface PlayerRolling extends INodotsPlayer {
  kind: 'player-rolling'
}
export interface PlayerMoving extends INodotsPlayer {
  kind: 'player-moving'
}

// export interface PlayerWinning extends INodotsPlayer {
//   kind: 'player-winning'
// }

// interface PlayerLosing extends INodotsPlayer {
//   kind: 'player-losing'
// }

// interface PlayerResigning extends INodotsPlayer {
//   kind: 'player-resigning'
// }

export type NodotsPlayer =
  | PlayerIncoming
  | PlayerInitializing
  | PlayerRollingForStart
  | PlayerRolling
  | PlayerMoving
  | PlayerWaiting
  // | PlayerResigning
  | PlayerWinning
// | PlayerLosing

export interface NodotsPlayersInitializing {
  kind: 'players-initializing'
  black: PlayerInitializing
  white: PlayerInitializing
}

export interface NodotsPlayersBlackRolling {
  black: PlayerRolling
  white: PlayerWaiting
}

export interface NodotsPlayersBlackMoving {
  black: PlayerMoving
  white: PlayerWaiting
}

export type NodotsPlayersBlackActive =
  | NodotsPlayersBlackRolling
  | NodotsPlayersBlackMoving

export interface NodotsPlayersWhiteRolling {
  black: PlayerWaiting
  white: PlayerRolling
}

export interface NodotsPlayersWhiteMoving {
  black: PlayerWaiting
  white: PlayerMoving
}

export type NodotsPlayersWhiteActive =
  | NodotsPlayersWhiteRolling
  | NodotsPlayersWhiteMoving

export type NodotsPlayers =
  | NodotsPlayersInitializing
  | NodotsPlayersBlackActive
  | NodotsPlayersWhiteActive

export interface NodotsPipCounts {
  black: number
  white: number
}

export interface PlayerWaiting extends INodotsPlayer {
  kind: 'player-waiting'
}

export interface PlayerInitializing extends INodotsPlayer {
  kind: 'player-initializing'
  email: string
  preferences?: {
    username: string
    color: NodotsColor
    direction: NodotsMoveDirection
    automation: {
      roll: boolean
      move: boolean
    }
  }
}

export interface PlayerRollingForStart extends INodotsPlayer {
  kind: 'player-rolling-for-start'
}

export interface PlayerRolling extends INodotsPlayer {
  kind: 'player-rolling'
}

export interface PlayerMoving extends INodotsPlayer {
  kind: 'player-moving'
}

export interface PlayerWinning extends INodotsPlayer {
  kind: 'player-winning'
}

export interface PlayerResiginging extends INodotsPlayer {
  kind: 'player-resigning'
}

export type NodotsPlayerState =
  | PlayerInitializing
  | PlayerRollingForStart
  | PlayerRolling
  | PlayerMoving
  | PlayerResiginging
  | PlayerWinning

export const initializingPlayer = (
  player: INodotsPlayer
): PlayerInitializing => {
  const { preferences, externalId, email, locale } = player
  // const { username, color, direction, automation } = preferences

  return {
    kind: 'player-initializing',
    externalId,
    email,
    locale,
  }
}

export const initializingPlayers = (
  players: INodotsPlayers
): NodotsPlayersInitializing => {
  return {
    kind: 'players-initializing',
    black: initializingPlayer(players.black),
    white: initializingPlayer(players.white),
  }
}

export const setPlayersActive = (
  color: NodotsColor,
  players:
    | NodotsPlayersInitializing
    | NodotsPlayersBlackActive
    | NodotsPlayersWhiteActive
): NodotsPlayersBlackActive | NodotsPlayersWhiteActive => {
  console.log('[Types: Player] setPlayersActive color:', color)
  console.log('[Types: Player] setPlayersActive players:', players)
  switch (color) {
    case 'black':
      return {
        white: {
          ...players.white,
          kind: 'player-waiting',
        },
        black: {
          ...players.black,
          kind: 'player-rolling',
        },
      }
    case 'white':
      return {
        white: {
          ...players.white,
          kind: 'player-rolling',
        },
        black: {
          ...players.black,
          kind: 'player-waiting',
        },
      }
    default:
      throw new Error('error.invalid-color')
  }
}
