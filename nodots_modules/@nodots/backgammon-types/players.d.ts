import { PlayerReady, PlayerPlaying, Player } from './player'

export interface NodotsPlayersReady {
  black: PlayerReady
  white: PlayerReady
}
export interface NodotsPlayersPlaying {
  black: PlayerPlaying
  white: PlayerPlaying
}

export type NodotsPlayers = [Player, Player]
