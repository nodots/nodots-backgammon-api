import { uuid as generateId } from 'uuidv4'
import { INodotsBoard, getCheckers } from '../Board'
import { NodotsColor, PlayerCheckers } from '../Game'

export interface INodotsChecker {
  id: string
  color: NodotsColor
  checkercontainerId: string
  highlight?: boolean
}

export interface NodotsGameCheckers {
  white: PlayerCheckers
  black: PlayerCheckers
}

export const getChecker = (board: INodotsBoard, id: string): INodotsChecker => {
  const checker = getCheckers(board).find((checker) => checker.id === id)
  if (!checker) {
    throw Error(`No checker found for ${id}`)
  }
  return checker
}

export const buildChecker = (
  color: NodotsColor,
  checkercontainerId: string
): INodotsChecker => {
  return { id: generateId(), color, checkercontainerId }
}

export const buildCheckersForCheckercontainerId = (
  color: NodotsColor,
  checkercontainerId: string,
  count: number
): INodotsChecker[] => {
  const checkers: INodotsChecker[] = []

  for (let i = 0; i < count; i++) {
    const checker: INodotsChecker = {
      id: generateId(),
      color,
      checkercontainerId,
    }
    checkers.push(checker)
  }
  return checkers
}
