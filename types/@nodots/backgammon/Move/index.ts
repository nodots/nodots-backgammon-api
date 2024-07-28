import { NodotsMoveDirection } from '../..'
import { DieValue } from '../Dice'

export interface INodotsMove {
  id: string
  isAuto: boolean
  isForced: boolean
  dieValue: DieValue
  direction: NodotsMoveDirection
}

export interface MoveInitializing extends INodotsMove {
  kind: 'move-initializing'
}
