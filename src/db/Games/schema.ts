import { pgTable, text, jsonb, pgEnum } from 'drizzle-orm/pg-core'

export const ColorEnum = pgEnum('color', ['black', 'white'])

export const GameStateEnum = pgEnum('game_state', [
  'rolling-for-start',
  'rolled-for-start',
  'rolling',
  'rolled',
  'doubling',
  'doubled',
  'moving',
  'moved',
  'completed',
])

export const GameTypeEnum = GameStateEnum

export const GamesTable = pgTable('games', {
  id: text('id').primaryKey(),
  state: GameTypeEnum('state').notNull(),
  board: jsonb('board').notNull(),
  players: jsonb('players').notNull(),
  cube: jsonb('cube').notNull(),
  active_color: ColorEnum('active_color'),
  active_play: jsonb('active_play'),
  winner: text('winner'),
})

export const DirectionEnum = pgEnum('direction', [
  'clockwise',
  'counterclockwise',
])
