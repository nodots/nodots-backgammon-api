import { uuid as generateId } from 'uuidv4'
import { INodotsChecker, buildCheckersForCheckercontainerId } from '../Checker'
import { Bar, INodotsCheckercontainer, Off, Point } from '../Checkercontainer'

export interface NodotsCheckercontainerImport {
  position: CheckercontainerPosition
  checkercount: number
}

export interface NodotsBoardImports {
  clockwise: NodotsBoardImport
  counterclockwise: NodotsBoardImport
}

import { BOARD_IMPORT_DEFAULT } from '../../../../board-setups'
import {
  NodotsPlayersPlaying,
  NodotsPlayers,
  NodotsPlayersReady,
} from '../Player'
import { CheckercontainerPosition, NodotsColor, PointPosition } from '../Game'
import {
  getClockwisePlayer,
  getCounterclockwisePlayer,
} from '../Player/helpers'

export type Latitude = 'north' | 'south'
export type Longitude = 'east' | 'west'

export type Points = [
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point
]

export type CheckercontainerCheckers =
  | []
  | [INodotsChecker]
  | [INodotsChecker, INodotsChecker]
  | [INodotsChecker, INodotsChecker, INodotsChecker]
  | [INodotsChecker, INodotsChecker, INodotsChecker, INodotsChecker]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]
  | [
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker,
      INodotsChecker
    ]

export interface INodotsBoard {
  points: Point[]
  bar: {
    white: Bar
    black: Bar
  }
  off: {
    white: Off
    black: Off
  }
}

export interface NodotsCheckercontainerImport {
  position: CheckercontainerPosition
  checkercount: number
}

export type NodotsBoardImport = NodotsCheckercontainerImport[]

const buildBar = (
  players: NodotsPlayersReady | NodotsPlayersPlaying,
  boards: NodotsBoardImports
): { white: Bar; black: Bar } => {
  const clockwisePlayer = getClockwisePlayer(players)
  const counterclockwisePlayer = getCounterclockwisePlayer(players)

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

const buildOff = (
  players: NodotsPlayersPlaying | NodotsPlayersReady,
  boards: NodotsBoardImports
): { white: Off; black: Off } => {
  // const clockwisePlayer = getClockwisePlayer(players)
  // const counterclockwisePlayer = getCounterclockwisePlayer(players)

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

export const buildBoard = (
  players: NodotsPlayersPlaying | NodotsPlayersReady,
  boardImports?: NodotsBoardImports
): INodotsBoard => {
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
    const checkers: INodotsChecker[] = []

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
    return {
      points: tempPoints,
      bar: buildBar(players, imports),
      off: buildOff(players, imports),
    }
  } else {
    throw Error(`invalid tempPoints length ${tempPoints.length}`)
  }
}

export const getCheckers = (board: INodotsBoard): INodotsChecker[] => {
  const checkercontainers = getCheckercontainers(board)
  const checkers: INodotsChecker[] = []

  checkercontainers.map((checkercontainer) =>
    checkers.push(...checkercontainer.checkers)
  )
  return checkers
}

export const getCheckersForColor = (
  board: INodotsBoard,
  color: NodotsColor
): INodotsChecker[] =>
  getCheckers(board).filter((checker) => checker.color === color)

export const getPoints = (board: INodotsBoard): Point[] => board.points
export const getBars = (board: INodotsBoard): Bar[] => [
  board.bar.white,
  board.bar.black,
]

export const getOffs = (board: INodotsBoard): Off[] => [
  board.off.white,
  board.off.black,
]

export const getCheckercontainers = (
  board: INodotsBoard
): INodotsCheckercontainer[] => {
  const points = getPoints(board) as INodotsCheckercontainer[]
  const bar = getBars(board) as INodotsCheckercontainer[]
  const off = getOffs(board) as INodotsCheckercontainer[]
  return points.concat(...bar).concat(...off)
}

export const getCheckercontainer = (
  board: INodotsBoard,
  id: string
): INodotsCheckercontainer => {
  const container = getCheckercontainers(board).find((c) => c.id === id)
  if (!container) {
    throw Error(`No checkercontainer found for ${id}`)
  }
  return container
}

export const getPipCounts = (board: INodotsBoard, players: NodotsPlayers) => {
  const pipCounts = {
    white: board.bar.white.checkers.length * 24,
    black: board.bar.black.checkers.length * 24,
  }

  // const clockwisePlayer = getClockwisePlayer(players)

  // board.points.map((point) => {
  //   if (point.checkers.length > 0) {
  //     const color = point.checkers[0].color

  //     if (color === clockwisePlayer.color) {
  //       pipCounts[color] += point.position.clockwise * point.checkers.length
  //     } else {
  //       pipCounts[color] +=
  //         point.position.counterclockwise * point.checkers.length
  //     }
  //   }
  // })
  return pipCounts
}
