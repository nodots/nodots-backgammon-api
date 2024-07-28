import { NodotsColor, PointPosition } from '../Types'
import { NodotsChecker } from './Checker'

export type Checkercontainer = {
  id: string
  kind: string
  checkers: NodotsChecker[]
}

export interface Point extends Checkercontainer {
  kind: 'point'
  position: {
    clockwise: PointPosition
    counterclockwise: PointPosition
  }
}

export interface Bar extends Checkercontainer {
  kind: 'bar'
  color: NodotsColor
  position: 'bar'
}

export interface Off extends Checkercontainer {
  kind: 'off'
  color: NodotsColor
  position: 'off'
}
