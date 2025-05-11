"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const AuthRouter = (db) => {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => {
        res.send('Welcome to the Nodots Backgammon Auth API!');
    });
    return router;
};
exports.AuthRouter = AuthRouter;
