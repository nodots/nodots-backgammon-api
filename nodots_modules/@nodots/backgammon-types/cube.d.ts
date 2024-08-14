import { IPlayer } from './player'

export type CubeValue = 2 | 4 | 8 | 16 | 32 | 64

export interface NodotsCube {
  value: CubeValue
  owner: IPlayer | undefined
}
