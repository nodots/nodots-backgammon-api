import {
  NodotsPlayerInitialized,
  NodotsPlayerPlaying,
  NodotsPlayerSeekingGame,
} from './player'

export interface NodotsPlayersInitialized {
  kind: 'players-initialized'
  black: NodotsPlayerInitialized
  white: NodotsPlayerInitialized
}

export interface NodotsPlayersSeekingGame {
  kind: 'players-seeking-game'
  seekers: [NodotsPlayerSeekingGame, NodotsPlayerSeekingGame]
}

export interface NodotsPlayersPlaying {
  kind: 'players-playing'
  black: NodotsPlayerPlaying
  white: NodotsPlayerPlaying
}
