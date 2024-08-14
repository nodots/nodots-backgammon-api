import { generateId } from '../../backgammon'
import { NodotsChecker } from '../../backgammon-types'
import { buildCheckersForCheckercontainerId } from '../Checker'
import {
  Bar,
  NodotsCheckercontainer,
  Off,
  Point,
} from '../../backgammon-types/checkercontainer'

const buildBar = (boards: NodotsBoardImports): { white: Bar; black: Bar } => {
  const clockwiseBoard = boards.clockwise
  const counterclockwiseBoard = boards.counterclockwise

  const clockwiseBar = clockwiseBoard.find((cc) => cc.position === 'bar')
  const counterclockwiseBar = counterclockwiseBoard.find(
    (cc) => cc.position === 'bar'
  )

  const clockwiseId = generateId()
  const counterclockwiseId = generateId()
  const clockwiseColor = 'black'
  const counterclockwiseColor = 'white'

  const clockwiseCheckers = buildCheckersForCheckercontainerId(
    clockwiseColor,
    clockwiseId,
    clockwiseBar?.checkercount ? clockwiseBar.checkercount : 0
  )

  const counterclockwiseCheckers = buildCheckersForCheckercontainerId(
    counterclockwiseColor,
    counterclockwiseId,
    counterclockwiseBar?.checkercount ? counterclockwiseBar.checkercount : 0
  )

  if (clockwiseColor === 'black') {
    return {
      black: {
        id: clockwiseId,
        kind: 'bar',
        position: 'bar',
        color: 'black',
        checkers: clockwiseCheckers,
      },
      white: {
        id: counterclockwiseId,
        kind: 'bar',
        position: 'bar',
        color: 'white',
        checkers: counterclockwiseCheckers,
      },
    }
  } else {
    return {
      black: {
        id: counterclockwiseId,
        kind: 'bar',
        position: 'bar',
        color: 'black',
        checkers: counterclockwiseCheckers,
      },
      white: {
        id: clockwiseId,
        kind: 'bar',
        position: 'bar',
        color: 'white',
        checkers: clockwiseCheckers,
      },
    }
  }
}

import { BOARD_IMPORT_DEFAULT } from '../../../../board-setups'
import { NodotsColor, PointPosition } from '../../backgammon-types/game'
import { NodotsPlayersPlaying } from '../Player/helpers'
import { getClockwisePlayer } from '../Player/helpers'
import {
  NodotsBoardImports,
  NodotsCheckercontainerImport,
  NodotsBoard,
  NodotsBoardImport,
  Points,
} from '../../backgammon-types/board'

const buildOff = (boards: NodotsBoardImports): { white: Off; black: Off } => {
  const clockwiseBoard = boards.clockwise
  const counterclockwiseBoard = boards.counterclockwise

  const clockwiseColor = 'black'
  const counterclockwiseColor = 'white'

  const clockwiseOff = clockwiseBoard.find(
    (cc) => cc.position === 'off'
  ) as unknown as NodotsCheckercontainerImport
  const counterclockwiseOff = counterclockwiseBoard.find(
    (cc) => cc.position === 'off'
  ) as unknown as NodotsCheckercontainerImport

  const clockwiseId = generateId()
  const counterclockwiseId = generateId()

  const clockwiseCheckers = buildCheckersForCheckercontainerId(
    clockwiseColor,
    clockwiseId,
    clockwiseOff?.checkercount ? clockwiseOff.checkercount : 0
  )

  const counterclockwiseCheckers = buildCheckersForCheckercontainerId(
    counterclockwiseColor,
    counterclockwiseId,
    counterclockwiseOff?.checkercount ? counterclockwiseOff.checkercount : 0
  )

  if (clockwiseColor === 'black') {
    return {
      black: {
        id: generateId(),
        kind: 'off',
        position: 'off',
        color: 'black',
        checkers: clockwiseCheckers,
      },
      white: {
        id: generateId(),
        kind: 'off',
        position: 'off',
        color: 'white',
        checkers: counterclockwiseCheckers,
      },
    }
  } else {
    return {
      black: {
        id: generateId(),
        kind: 'off',
        position: 'off',
        color: 'black',
        checkers: counterclockwiseCheckers,
      },
      white: {
        id: generateId(),
        kind: 'off',
        position: 'off',
        color: 'white',
        checkers: clockwiseCheckers,
      },
    }
  }
}

export const buildBoard = (boardImports?: NodotsBoardImports): NodotsBoard => {
  let clockwiseBoardImport: NodotsBoardImport = BOARD_IMPORT_DEFAULT
  let counterclockwiseBoardImport = BOARD_IMPORT_DEFAULT

  if (boardImports && boardImports.clockwise) {
    clockwiseBoardImport = boardImports.clockwise
  }

  if (boardImports && boardImports.counterclockwise) {
    counterclockwiseBoardImport = boardImports.counterclockwise
  }

  const imports: NodotsBoardImports = {
    clockwise: clockwiseBoardImport,
    counterclockwise: counterclockwiseBoardImport,
  }
  const tempPoints: Point[] = []
  console.log('[Board] buildBoard imports:', imports)
  const clockwiseColor = 'black'
  const counterclockwiseColor = 'white'

  for (let i = 0; i < 24; i++) {
    const pointId = generateId()
    const checkers: NodotsChecker[] = []

    const clockwisePosition: PointPosition = (i + 1) as number as PointPosition
    const counterclockwisePosition = (25 - clockwisePosition) as PointPosition

    clockwiseBoardImport.map((checkerbox) => {
      if (checkerbox.position === clockwisePosition) {
        const checkercount = checkerbox.checkercount
        checkers.push(
          ...buildCheckersForCheckercontainerId(
            clockwiseColor,
            pointId,
            checkercount
          )
        )
      }
    })

    counterclockwiseBoardImport.map(
      (checkerbox: NodotsCheckercontainerImport) => {
        if (checkerbox.position === counterclockwisePosition) {
          const checkercount = checkerbox.checkercount
          checkers.push(
            ...buildCheckersForCheckercontainerId(
              counterclockwiseColor,
              pointId,
              checkercount
            )
          )
        }
      }
    )

    const point: Point = {
      id: pointId,
      kind: 'point',
      position: {
        clockwise: clockwisePosition,
        counterclockwise: counterclockwisePosition,
      },
      checkers,
    }
    tempPoints.push(point)
  }

  if (tempPoints.length === 24) {
    const points: Points = tempPoints as Points
    return {
      points,
      bar: buildBar(imports),
      off: buildOff(imports),
    }
  } else {
    throw Error(`invalid tempPoints length ${tempPoints.length}`)
  }
}

export const getCheckers = (board: NodotsBoard): NodotsChecker[] => {
  const checkercontainers = getCheckercontainers(board)
  const checkers: NodotsChecker[] = []

  checkercontainers.map((checkercontainer) =>
    checkers.push(...checkercontainer.checkers)
  )
  return checkers
}

export const getCheckersForColor = (
  board: NodotsBoard,
  color: NodotsColor
): NodotsChecker[] =>
  getCheckers(board).filter((checker) => checker.color === color)

export const getPoints = (board: NodotsBoard): Point[] => board.points
export const getBars = (board: NodotsBoard): Bar[] => [
  board.bar.white,
  board.bar.black,
]

export const getOffs = (board: NodotsBoard): Off[] => [
  board.off.white,
  board.off.black,
]

export const getCheckercontainers = (
  board: NodotsBoard
): NodotsCheckercontainer[] => {
  const points = getPoints(board) as NodotsCheckercontainer[]
  const bar = getBars(board) as NodotsCheckercontainer[]
  const off = getOffs(board) as NodotsCheckercontainer[]
  return points.concat(...bar).concat(...off)
}

export const getCheckercontainer = (
  board: NodotsBoard,
  id: string
): NodotsCheckercontainer => {
  const container = getCheckercontainers(board).find((c) => c.id === id)
  if (!container) {
    throw Error(`No checkercontainer found for ${id}`)
  }
  return container
}

export const getPipCounts = (
  board: NodotsBoard,
  players: NodotsPlayersPlaying
) => {
  const pipCounts = {
    white: board.bar.white.checkers.length * 24,
    black: board.bar.black.checkers.length * 24,
  }

  const clockwisePlayer = getClockwisePlayer(players)

  board.points.map((point) => {
    if (point.checkers.length > 0) {
      const color = point.checkers[0].color

      if (color === clockwisePlayer.color) {
        pipCounts[color] += point.position.clockwise * point.checkers.length
      } else {
        pipCounts[color] +=
          point.position.counterclockwise * point.checkers.length
      }
    }
  })
  return pipCounts
}
