import { INodotsChecker } from '../Checker'
import { NodotsColor, PointPosition } from '../Game'

export type INodotsCheckercontainer = {
  id: string
  kind: string
  checkers: INodotsChecker[]
}

export interface Point extends INodotsCheckercontainer {
  kind: 'point'
  position: {
    clockwise: PointPosition
    counterclockwise: PointPosition
  }
}

export interface Bar extends INodotsCheckercontainer {
  kind: 'bar'
  color: NodotsColor
  position: 'bar'
}

export interface Off extends INodotsCheckercontainer {
  kind: 'off'
  color: NodotsColor
  position: 'off'
}
