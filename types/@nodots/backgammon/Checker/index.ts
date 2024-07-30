import { uuid as generateId } from 'uuidv4'
import { NodotsBoard, getCheckers } from '../Board'
import { NodotsColor, PlayerCheckers } from '../Game'

export interface NodotsChecker {
  id: string
  color: NodotsColor
  checkercontainerId: string
  highlight?: boolean
}

export interface NodotsGameCheckers {
  white: PlayerCheckers
  black: PlayerCheckers
}

export const getChecker = (board: NodotsBoard, id: string): NodotsChecker => {
  const checker = getCheckers(board).find((checker) => checker.id === id)
  if (!checker) {
    throw Error(`No checker found for ${id}`)
  }
  return checker
}

export const buildChecker = (
  color: NodotsColor,
  checkercontainerId: string
): NodotsChecker => {
  return { id: generateId(), color, checkercontainerId }
}

export const buildCheckersForCheckercontainerId = (
  color: NodotsColor,
  checkercontainerId: string,
  count: number
): NodotsChecker[] => {
  const checkers: NodotsChecker[] = []

  for (let i = 0; i < count; i++) {
    const checker: NodotsChecker = {
      id: generateId(),
      color,
      checkercontainerId,
    }
    checkers.push(checker)
  }
  return checkers
}
