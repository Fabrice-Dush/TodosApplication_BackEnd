"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.authenticate = void 0;
const user_1 = __importDefault(require("./../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("./../secret");
const authenticate = async function (req, res, next) {
    console.log(req.headers);
    const token = req.headers.token;
    const decoded = await jsonwebtoken_1.default.verify(token, secret_1.SECRET);
    const user = await user_1.default.findById(decoded.id);
    if (!user)
        return res.status(401).json({
            ok: false,
            message: 'fail',
            errors: { message: 'Login to access this resource' },
        });
    req.body.authenticatedUser = user;
    next();
};
exports.authenticate = authenticate;
const checkUser = async function (req, res, next) {
    next();
};
exports.checkUser = checkUser;
//# sourceMappingURL=middleware.js.map