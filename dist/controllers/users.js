"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.settings = exports.logout = exports.signupPOST = exports.signupGET = exports.loginPOST = exports.loginGET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importStar(require("./../models/user"));
const secret_1 = require("./../secret");
const maxAge = 3 * 24 * 60 * 60;
const generateToken = function (id) {
    const token = jsonwebtoken_1.default.sign({ id }, secret_1.SECRET, {
        expiresIn: maxAge,
    });
    return token;
};
const loginGET = async function (req, res, next) {
    try {
        res
            .status(200)
            .json({ ok: true, message: 'success', data: 'Display login form' });
    }
    catch (err) {
        next(err);
    }
};
exports.loginGET = loginGET;
const loginPOST = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await (0, user_1.login)(email, password);
        if (!user)
            throw new Error('Wrong email or password');
        const token = generateToken(user.id);
        res.status(200).json({
            ok: true,
            message: 'success',
            token,
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.loginPOST = loginPOST;
const signupGET = async function (req, res) {
    try {
        res
            .status(200)
            .json({ ok: true, message: 'success', data: 'Display signup form' });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            message: 'fail',
            errors: err,
        });
    }
};
exports.signupGET = signupGET;
const signupPOST = async function (req, res, next) {
    try {
        const user = new user_1.default(req.body);
        await user.save();
        const token = generateToken(user.id);
        res.status(201).json({ ok: true, message: 'success', token, data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.signupPOST = signupPOST;
const logout = function (req, res, next) {
    try {
        console.log('Logged you out bruh');
        res.status(200).json({ ok: true, message: 'success' });
    }
    catch (err) {
        res.status(500).json({ ok: false, message: 'fail' });
    }
};
exports.logout = logout;
const settings = async function (req, res) {
    try {
        res.render('users/settings');
    }
    catch (err) { }
};
exports.settings = settings;
const deleteAccount = async function (req, res, next) {
    try {
        const user = req.body.authenticatedUser;
        const msg = await user_1.default.findByIdAndDelete(user.id);
        res.redirect('/todos');
    }
    catch (err) {
        next(err);
    }
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=users.js.map