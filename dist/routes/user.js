"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const users_1 = require("./../controllers/users");
const middleware_1 = require("./../middleware/middleware");
router.route('/login').get(users_1.loginGET).post(users_1.loginPOST);
router.route('/signup').get(users_1.signupGET).post(users_1.signupPOST);
router.get('/logout', users_1.logout);
router.get('/settings', middleware_1.authenticate, users_1.settings);
router.delete('/deleteaccount', middleware_1.authenticate, users_1.deleteAccount);
module.exports = router;
exports.default = router;
//# sourceMappingURL=user.js.map