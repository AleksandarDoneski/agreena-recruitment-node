"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("./login");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.render('login');
});
router.post('/', async (req, res) => {
    await (0, login_1.checkCredentials)(req.body);
    res.send('login');
});
exports.default = router;
