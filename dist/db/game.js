"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbGetActiveGameByPlayerId = exports.dbGetGame = exports.dbGetAll = exports.dbCreateGame = exports.GamesTable = exports.DirectionEnum = exports.ColorEnum = exports.GameTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const src_1 = require("../../nodots_modules/@nodots/nodots-backgammon-core/src");
const error_1 = require("../types/error");
const GAME_ROLLING_FOR_START = 'rolling-for-start';
const GAME_ROLLED_FOR_START = 'rolled-for-start';
const GAME_ROLLING = 'rolling';
const GAME_MOVING = 'moving';
const GAME_COMPLETED = 'completed';
exports.GameTypeEnum = (0, pg_core_1.pgEnum)('game_type', [
    GAME_ROLLING_FOR_START,
    GAME_ROLLED_FOR_START,
    GAME_ROLLING,
    GAME_MOVING,
    GAME_COMPLETED,
]);
const BLACK = 'black';
const WHITE = 'white';
exports.ColorEnum = (0, pg_core_1.pgEnum)('color', [BLACK, WHITE]);
const CLOCKWISE = 'clockwise';
const COUNTERCLOCKWISE = 'counterclockwise';
exports.DirectionEnum = (0, pg_core_1.pgEnum)('direction', [CLOCKWISE, COUNTERCLOCKWISE]);
exports.GamesTable = (0, pg_core_1.pgTable)('games', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom().notNull(),
    stateKind: (0, exports.GameTypeEnum)('kind').notNull(),
    players: (0, pg_core_1.jsonb)('players').notNull(),
    board: (0, pg_core_1.jsonb)('board').notNull(),
    cube: (0, pg_core_1.jsonb)('cube').notNull(),
    winner: (0, pg_core_1.jsonb)('winner'),
    activeColor: (0, exports.ColorEnum)('active_color'),
    activePlay: (0, pg_core_1.jsonb)('active_play'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
const dbCreateGame = async (gameInitializing, db) => {
    const game = {
        ...gameInitializing,
        stateKind: gameInitializing.stateKind,
        players: [
            {
                playerId: gameInitializing.players[0].id,
                color: gameInitializing.players[0].color,
                direction: gameInitializing.players[0].direction,
                pipCount: gameInitializing.players[0].pipCount,
            },
            {
                playerId: gameInitializing.players[1].id,
                color: gameInitializing.players[1].color,
                direction: gameInitializing.players[1].direction,
                pipCount: gameInitializing.players[1].pipCount,
            },
        ],
    };
    const result = await db.insert(exports.GamesTable).values(game).returning();
    if (result.length !== 1) {
        throw (0, error_1.GameStateError)('[Game API DB] dbCreateGame: Game not created');
    }
    return result[0];
};
exports.dbCreateGame = dbCreateGame;
const dbGetAll = async (db) => await db.select().from(exports.GamesTable);
exports.dbGetAll = dbGetAll;
const dbGetGame = async (gameId, db) => {
    if (!(0, src_1.isValidUuid)(gameId)) {
        return console.error('[Game API DB] dbGetGame Invalid gameId:', gameId);
    }
    const game = await db
        .select()
        .from(exports.GamesTable)
        .where((0, drizzle_orm_1.eq)(exports.GamesTable.id, gameId))
        .limit(1);
    if (!game) {
        console.error('No game found');
    }
    return game;
};
exports.dbGetGame = dbGetGame;
// '9b311cbb-e0d2-4d7b-ad91-b629aa2c7612'
// ATM players can only have one active game. But this is not enforced in the db
const dbGetActiveGameByPlayerId = async (playerId, db) => {
    // FIXME: Not loving using 'sql' but drizzle seems to still have problems w jsonb
    const result = await db.execute((0, drizzle_orm_1.sql) `SELECT * FROM games WHERE players->0->>'playerId' = ${playerId} OR players->1->>'playerId' = ${playerId}`);
    console.log(`[Game API Db] dbGetActiveGameByPlayerId ${playerId} result:`, result.rows);
    return result.rows;
};
exports.dbGetActiveGameByPlayerId = dbGetActiveGameByPlayerId;
