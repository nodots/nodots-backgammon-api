"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRouter = void 0;
const express_1 = require("express");
const GameRouter = () => {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        return { message: 'Welcome to the Nodots Backgammon Game API!' };
    });
    router.post('/game', async (req, res) => {
        const players = req.body.players;
        return { message: 'Welcome to the Nodots Backgammon Game API!', players };
    });
    return router;
};
exports.GameRouter = GameRouter;
