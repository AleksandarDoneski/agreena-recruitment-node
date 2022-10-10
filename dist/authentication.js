"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
function authMiddleware(req, res, next) {
    const { headers } = req;
    console.log(headers.authorization);
    if (headers.authorization) {
        console.log('has auth');
        next();
    }
    console.log('no auth');
    res.send('no auth');
}
exports.authMiddleware = authMiddleware;
