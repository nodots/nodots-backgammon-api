"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const now = new Date().toISOString();
    console.log(`bgapi> REQUEST: [${now}] ${req.method} ${req.url}`);
    console.log('bgapi> ORIGIN:', req.headers.origin);
    console.log('bgapi> BODY:', req.body);
    next();
};
exports.requestLogger = requestLogger;
