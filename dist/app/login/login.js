"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredentials = void 0;
const database_1 = require("../../database");
async function checkCredentials(body) {
    const { username, password } = body;
    const user = await database_1.User.findOne({ where: { Username: username } });
    if (!user) {
        return false;
    }
    console.log(user.getDataValue('Username'));
    // if (user.getDataValue() === username && user.Password === password) {
    //     return true;
    // }
    return false;
}
exports.checkCredentials = checkCredentials;
