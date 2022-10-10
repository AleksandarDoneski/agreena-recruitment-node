"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
var cors = require('cors');
const routes_1 = __importDefault(require("./app/login/routes"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(cors());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use('/login', routes_1.default);
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.listen(PORT, async () => {
    console.log(`Server started on port: ${PORT}`);
    await (0, database_1.intilizeDb)();
});
