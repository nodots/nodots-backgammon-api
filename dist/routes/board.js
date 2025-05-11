"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRouter = void 0;
const express_1 = require("express");
const nodots_backgammon_core_1 = require("nodots-backgammon-core");
const BoardRouter = () => {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        const board = nodots_backgammon_core_1.Board.getAsciiBoard(nodots_backgammon_core_1.Board.initialize());
        return res.status(200).send(board);
    });
    return router;
};
exports.BoardRouter = BoardRouter;
