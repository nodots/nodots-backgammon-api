import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { NodotsColor, NodotsMoveDirection } from '../Game'
import {
  dbCreatePlayer,
  dbFetchPlayers,
  dbFetchPlayersSeekingGame,
  dbSetPlayerReady,
  dbSetPlayerSeekingGame,
} from './db'

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
  id: string
  email: string
  preferences?: INodotsPlayerPreferences
}

export interface INodotsPlayers {
  black: INodotsPlayer
  white: INodotsPlayer
}

export type NodotsPlayerPlaying =
  | PlayerPlayingWaiting
  | PlayerPlayingRolling
  | PlayerPlayingMoving

export interface NodotsPlayersPlaying {
  kind: 'players-playing'
  black: NodotsPlayerPlaying
  white: NodotsPlayerPlaying
}

export interface NodotsPlayersSeekingGame {
  kind: 'players-seeking-game'
  seekers: [PlayerSeekingGame, PlayerSeekingGame]
}

export interface PlayerKnocking extends INodotsPlayer {
  kind: 'player-knocking'
  source: string
  externalId: string
  preferences?: INodotsPlayerPreferences
}

export interface PlayerInitialized extends INodotsPlayer {
  kind: 'player-initialized'
  source: string
  externalId: string
  preferences?: INodotsPlayerPreferences
}

export interface PlayerSeekingGame extends INodotsPlayer {
  kind: 'player-seeking-game'
  source: string
  externalId: string
  preferences?: INodotsPlayerPreferences
}

export interface PlayerReady extends INodotsPlayer {
  kind: 'player-ready'
  source: string
  externalId: string
  color: NodotsColor
  direction: NodotsMoveDirection
  preferences?: INodotsPlayerPreferences
}

export interface PlayerPlayingWaiting extends INodotsPlayer {
  kind: 'player-waiting'
  color: NodotsColor
  direction: NodotsMoveDirection
}

export interface PlayerPlayingRolling extends INodotsPlayer {
  kind: 'player-rolling'
  color: NodotsColor
  direction: NodotsMoveDirection
}
export interface PlayerPlayingMoving extends INodotsPlayer {
  kind: 'player-moving'
  color: NodotsColor
  direction: NodotsMoveDirection
}

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

export const initialize = async (
  playerKnocking: PlayerKnocking,
  db: NodePgDatabase<Record<string, never>>
) => dbCreatePlayer(playerKnocking, db)

export const fetchAll = async (db: NodePgDatabase<Record<string, never>>) =>
  await dbFetchPlayers(db)

export const seekingGame = async (db: NodePgDatabase<Record<string, never>>) =>
  await dbFetchPlayersSeekingGame(db)

export const setPlayerSeekingGame = async (
  id: string,
  db: NodePgDatabase<Record<string, never>>
) => await dbSetPlayerSeekingGame(id, db)

export const setPlayerReady = async (
  id: string,
  color: NodotsColor,
  direction: NodotsMoveDirection,
  db: NodePgDatabase<Record<string, never>>
) => await dbSetPlayerReady({ id, color, direction, db })
