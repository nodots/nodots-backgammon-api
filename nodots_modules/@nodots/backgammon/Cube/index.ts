import { IPlayer } from '../Player'

export type CubeValue = 2 | 4 | 8 | 16 | 32 | 64

export interface INodotsCube {
  value: CubeValue
  owner: IPlayer | undefined
}

export const buildCube = (): INodotsCube => {
  return {
    value: 2,
    owner: undefined,
  }
}

export const double = (cube: INodotsCube): CubeValue => {
  let cubeValue = cube.value as number
  cubeValue = cubeValue === 64 ? cube.value : cube.value * 2
  return cubeValue as CubeValue
}
