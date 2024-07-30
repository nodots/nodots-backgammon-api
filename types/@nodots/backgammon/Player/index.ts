import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { NodotsColor, NodotsMoveDirection } from '../Game'
import { create, getAll, getSeekingGame, setSeekingGame } from './db'
import { PgUUID } from 'drizzle-orm/pg-core'

export type NodotsLocale = 'en' | 'es'

export interface INodotsPlayerPreferences {
  username?: string
  color?: NodotsColor
  direction?: NodotsMoveDirection
  locale?: NodotsLocale
  automation?: {
    roll: boolean
    move: boolean
  }
}

export type INodotsPlayer = {
  email: string
  preferences?: INodotsPlayerPreferences
}

export interface INodotsPlayers {
  black: INodotsPlayer
  white: INodotsPlayer
}

export interface NodotsPlayersPlaying {
  black: PlayerPlayingWaiting | PlayerPlayingRolling | PlayerPlayingMoving
  white: PlayerPlayingWaiting | PlayerPlayingRolling | PlayerPlayingMoving
}

export interface PlayerKnocking extends INodotsPlayer {
  kind: 'player-knocking'
  source: string
  externalId: string
  preferences?: INodotsPlayerPreferences
}

export interface PlayerInitialized extends INodotsPlayer {
  id: string
  kind: 'player-initialized'
  source: string
  externalId: string
  preferences?: INodotsPlayerPreferences
}

export interface PlayerSeekingGame extends INodotsPlayer {
  id: string
  kind: 'player-seeking-game'
  source: string
  externalId: string
  preferences?: INodotsPlayerPreferences
}

export interface PlayerReady extends INodotsPlayer {
  id: string
  kind: 'player-ready'
  source: string
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: INodotsPlayerPreferences
}

export interface PlayerPlayingWaiting extends INodotsPlayer {
  id: string
  kind: 'player-waiting'
  color: NodotsColor
  direction: NodotsMoveDirection
}

export interface PlayerPlayingRolling extends INodotsPlayer {
  id: string
  kind: 'player-rolling'
  color: NodotsColor
  direction: NodotsMoveDirection
}
export interface PlayerPlayingMoving extends INodotsPlayer {
  id: string
  kind: 'player-moving'
  color: NodotsColor
  direction: NodotsMoveDirection
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
  | PlayerKnocking
  | PlayerInitialized
  | PlayerSeekingGame
  | PlayerReady
  | PlayerPlayingWaiting
  | PlayerPlayingRollingForStart
  | PlayerPlayingRolling
  | PlayerPlayingMoving
  | PlayerPlayingWaiting

export interface NodotsPlayersReady {
  kind: 'players-ready'
  black: PlayerReady
  white: PlayerReady
}

export interface NodotsPlayersBlackRolling {
  black: PlayerPlayingRolling
  white: PlayerPlayingWaiting
}

export interface NodotsPlayersBlackMoving {
  black: PlayerPlayingMoving
  white: PlayerPlayingWaiting
}

export type NodotsPlayersBlackActive =
  | NodotsPlayersBlackRolling
  | NodotsPlayersBlackMoving

export interface NodotsPlayersWhiteRolling {
  black: PlayerPlayingWaiting
  white: PlayerPlayingRolling
}

export interface NodotsPlayersWhiteMoving {
  black: PlayerPlayingWaiting
  white: PlayerPlayingMoving
}

export type NodotsPlayersWhiteActive =
  | NodotsPlayersWhiteRolling
  | NodotsPlayersWhiteMoving

export type NodotsPlayers =
  | NodotsPlayersReady
  | NodotsPlayersBlackActive
  | NodotsPlayersWhiteActive

export interface NodotsPipCounts {
  black: number
  white: number
}

export interface PlayerKnocking extends INodotsPlayer {
  kind: 'player-knocking'
  source: string
  email: string
}

export interface PlayerPlayingWaiting extends INodotsPlayer {
  kind: 'player-waiting'
}

export interface PlayerPlayingRollingForStart extends INodotsPlayer {
  kind: 'player-rolling-for-start'
}

export interface PlayerPlayingRolling extends INodotsPlayer {
  kind: 'player-rolling'
}

export interface PlayerPlayingMoving extends INodotsPlayer {
  kind: 'player-moving'
}

export interface PlayerWinning extends INodotsPlayer {
  kind: 'player-winning'
}

export interface PlayerResiginging extends INodotsPlayer {
  kind: 'player-resigning'
}

export type NodotsPlayerState =
  | PlayerKnocking
  | PlayerInitialized
  | PlayerSeekingGame
  | PlayerReady
  | PlayerPlayingWaiting
  | PlayerPlayingRollingForStart
  | PlayerPlayingRolling
  | PlayerPlayingMoving
  | PlayerResiginging
  | PlayerWinning

export const initialized = async (
  player: PlayerKnocking,
  db: NodePgDatabase<Record<string, never>>
) => {
  return await create(player, db)
}

export const list = async (db: NodePgDatabase<Record<string, never>>) => {
  return await getAll(db)
}

export const seekingGame = async (
  db: NodePgDatabase<Record<string, never>>
) => {
  return await getSeekingGame(db)
}
export const setPlayerSeekingGame = async (
  playerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const guid = playerId as unknown as PgUUID<any> // FIXME
  const seeking = await setSeekingGame(guid, db)
  console.log('[Types: Player] seeking:', seeking)
  return seeking
}

export const setPlayersActive = (
  color: NodotsColor,
  players:
    | NodotsPlayersReady
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
