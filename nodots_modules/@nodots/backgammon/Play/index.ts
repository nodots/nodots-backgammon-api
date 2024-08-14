import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { NodotsColor, NodotsMoveDirection } from '../Game'
import { dbCreatePlay } from './db'
import {
  IPlayer,
  NodotsPlayerPlayingMoving,
  NodotsPlayerPlayingRolling,
  PlayerReady,
} from '../Player'
import { DieValue } from '../Dice'
import { MoveInitializing, NodotsMove } from '../Move'

export interface NodotsPlay {
  id: string
  kind:
    | 'play-initializing'
    | 'play-rolling'
    | 'play-moving'
    | 'play-moved'
    | 'play-confirming'
    // these last two will require some thought because they are fundamentally different
    | 'play-dice-switched'
    | 'play-doubling'

  activeColor: NodotsColor
  player: NodotsPlayerPlayingRolling | NodotsPlayerPlayingMoving
}

export interface PlayInitializing extends NodotsPlay {
  kind: 'play-initializing'
}

export interface PlayRolling extends NodotsPlay {
  kind: 'play-rolling'
}

export const initialize = async (
  player: NodotsPlayerPlayingRolling,
  db: NodePgDatabase<Record<string, never>>
) => {}

// export interface PlayDoubling extends NodotsPlay {
//   kind: 'play-rolling'
//   activeColor: NodotsColor
//   player: PlayerPlayingRolling
// }

// export interface PlayMoving extends NodotsPlay {
//   kind: 'play-moving'
//   player: PlayerPlayingMoving
//   roll: Roll
//   isForced: boolean
//   analysis: {
//     options: []
//   }
//   moves: NodotsMove[]
// }

// export interface PlayDiceSwitched extends NodotsPlay {
//   kind: 'play-dice-switched'
//   player: PlayerMoving | PlayerRolling
//   roll: Roll
//   isForced: boolean
//   analysis: {
//     options: []
//   }
//   moves: NodotsMove[]
// }

// // Transition to this state when the destination of the final move is set,
// // i.e., second checker clicked.
// export interface PlayMoved extends NodotsPlay {
//   kind: 'play-moved'
//   activeColor: NodotsColor
//   roll: Roll
//   isForced: boolean
//   analysis: {
//     options: []
//   }
//   moves: NodotsMove[]
// }

// export interface PlayConfirming extends NodotsPlay {
//   kind: 'play-confirming'
//   activeColor: NodotsColor
//   roll: Roll
//   isForced: boolean
//   analysis: {
//     options: []
//   }
//   moves: NodotsMove[]
// }

// export type NodotsPlayState =
//   | PlayInitializing
//   | PlayRolling
//   | PlayDiceSwitched
//   | PlayMoving
//   | PlayDoubling
//   | PlayConfirming

// export const initializing = (
//   player: PlayerRolling,
//   roll: Roll
// ): PlayRolling => {
//   const moves = buildMovesForRoll(roll, player)

//   return {
//     kind: 'play-rolling',
//     player,
//     activeColor: player.color,
//     moves,
//   }
// }

// const buildMove = (
//   dieValue: DieValue,
//   player: INodotsPlayer
// ): MoveInitializing => {
//   return {
//     kind: 'move-initializing',
//     dieValue,
//     isAuto: player.automation.move,
//     direction: player.direction,
//     isForced: false,
//   }
// }

// const buildMovesForRoll = (roll: Roll, player: INodotsPlayer): NodotsMove[] => {
//   const moves: NodotsMove[] = [
//     buildMove(roll[0], player),
//     buildMove(roll[1], player),
//   ]

//   return moves
// }
