"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodotsDbClient = void 0;
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const board_1 = require("./routes/board");
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./middleware/logger");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
exports.nodotsDbClient = new pg_1.Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'nodots',
    password: 'nodots',
    database: 'nodots_backgammon_dev',
});
const main = async () => {
    await exports.nodotsDbClient.connect();
    // const db = drizzle(nodotsDbClient)
    // Middleware to parse JSON
    app.use(express_1.default.json());
    // FIXME: This is a security risk. Do not use in production.
    app.use((0, cors_1.default)({
        origin: '*',
        methods: '*',
        allowedHeaders: '*',
    }));
    // Use the request logger middleware
    app.use(logger_1.requestLogger);
    app.get('/', (req, res) => {
        res.send('Welcome to the Nodots Backgammon API!\n\nhttps://github.com/nodots/nodots-backgammon-api');
    });
    // app.post('/user', (req, res) => {
    //   res.status(200).json(req.body)
    // })
    // const authRouter = AuthRouter(db)
    // const userRouter = UserRouter(db)
    // const playerRouter = PlayerRouter(db)
    // const offerRouter = OfferRouter(db)
    // const gameRouter = GameRouter(db)
    const boardRouter = (0, board_1.BoardRouter)();
    // app.use('/auth', authRouter)
    // app.use('/user', userRouter)
    // app.use('/player', playerRouter)
    // app.use('/game', gameRouter)
    app.use('/board', boardRouter);
    // app.use('/offer', offerRouter)
    // Start the server
    app.listen(port, () => {
        console.log(`bgapi> Server is running on http://localhost:${port}`);
    });
};
main();
