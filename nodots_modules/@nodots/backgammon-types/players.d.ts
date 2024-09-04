import {
  PlayerInitialized,
  PlayerPlaying,
  PlayerSeekingGame,
  NodotsPlayer,
} from './player'

export interface NodotsPlayersInitialized {
  kind: 'players-initialized'
  black: PlayerInitialized
  white: PlayerInitialized
}

export interface NodotsPlayersSeekingGame {
  kind: 'players-seeking-game'
  seekers: [PlayerSeekingGame, PlayerSeekingGame]
}

export interface NodotsPlayersPlaying {
  kind: 'players-playing'
  black: PlayerPlaying
  white: PlayerPlaying
}

export type NodotsPlayers = [NodotsPlayer, NodotsPlayer]
