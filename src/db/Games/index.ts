import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { GamesTable } from './schema'
import {
  BackgammonGame,
  BackgammonPlayer,
  BackgammonPlayers,
} from '@nodots-llc/backgammon-types'

export * from './schema'

export const saveGame = async (
  game: BackgammonGame,
  db: NodePgDatabase
): Promise<void> => {
  try {
    const gameForDb = {
      id: game.id,
      state: game.stateKind,
      board: game.board,
      players: game.players,
      cube: game.cube,
      active_color: game.activeColor,
      active_play: game.activePlay,
      winner: game.winner?.id,
    }
    await db.insert(GamesTable).values(gameForDb)
  } catch (error) {
    console.error('Error saving game:', error)
    throw new Error('Failed to save game')
  }
}

export const getGames = async (
  db: NodePgDatabase
): Promise<BackgammonGame[]> => {
  try {
    const gamesFromDb = await db.select().from(GamesTable)

    const games: BackgammonGame[] = gamesFromDb.map((gameFromDb) => {
      const players = JSON.parse(
        gameFromDb.players as string
      ) as BackgammonPlayers
      const activeColor =
        gameFromDb.active_color as BackgammonGame['activeColor']

      let activePlayer: BackgammonPlayer | undefined
      let inactivePlayer: BackgammonPlayer | undefined

      if (activeColor) {
        activePlayer = players.find((p) => p.color === activeColor)
        inactivePlayer = players.find((p) => p.color !== activeColor)
      }

      const winnerId = gameFromDb.winner as string | null
      const winner = winnerId
        ? players.find((p) => p.id === winnerId)
        : undefined

      return {
        id: gameFromDb.id as string,
        stateKind: gameFromDb.state as BackgammonGame['stateKind'],
        board: JSON.parse(gameFromDb.board as string),
        players,
        cube: JSON.parse(gameFromDb.cube as string),
        activeColor,
        activePlay: gameFromDb.active_play
          ? JSON.parse(gameFromDb.active_play as string)
          : undefined,
        winner,
        activePlayer,
        inactivePlayer,
      } as BackgammonGame
    })

    return games
  } catch (error) {
    console.error('Error getting games:', error)
    throw new Error('Failed to get games')
  }
}

export const getGame = async (
  db: NodePgDatabase,
  id: string
): Promise<BackgammonGame | undefined> => {
  try {
    const [gameFromDb] = await db
      .select()
      .from(GamesTable)
      .where(eq(GamesTable.id, id))

    if (!gameFromDb) {
      return undefined
    }

    const players = JSON.parse(
      gameFromDb.players as string
    ) as BackgammonPlayers
    const activeColor = gameFromDb.active_color as BackgammonGame['activeColor']

    let activePlayer: BackgammonPlayer | undefined
    let inactivePlayer: BackgammonPlayer | undefined

    if (activeColor) {
      activePlayer = players.find((p) => p.color === activeColor)
      inactivePlayer = players.find((p) => p.color !== activeColor)
    }

    const winnerId = gameFromDb.winner as string | null
    const winner = winnerId ? players.find((p) => p.id === winnerId) : undefined

    return {
      id: gameFromDb.id as string,
      stateKind: gameFromDb.state as BackgammonGame['stateKind'],
      board: JSON.parse(gameFromDb.board as string),
      players,
      cube: JSON.parse(gameFromDb.cube as string),
      activeColor,
      activePlay: gameFromDb.active_play
        ? JSON.parse(gameFromDb.active_play as string)
        : undefined,
      winner,
      activePlayer,
      inactivePlayer,
    } as BackgammonGame
  } catch (error) {
    console.error('Error getting game:', error)
    throw new Error('Failed to get game')
  }
}

export const updateGame = async (
  db: NodePgDatabase,
  game: BackgammonGame
): Promise<void> => {
  try {
    const gameForDb = {
      state: game.stateKind,
      board: game.board,
      players: game.players,
      cube: game.cube,
      active_color: game.activeColor,
      active_play: game.activePlay,
      winner: game.winner?.id,
    }
    await db.update(GamesTable).set(gameForDb).where(eq(GamesTable.id, game.id))
  } catch (error) {
    console.error('Error updating game:', error)
    throw new Error('Failed to update game')
  }
}
