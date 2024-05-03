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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const todo_1 = __importDefault(require("./todo"));
const { isEmail } = validator_1.default;
const userSchema = new mongoose_1.Schema({
    username: String,
    salt: {
        type: String,
    },
    fullname: { type: String, minlength: 5 },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: isEmail,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        validate: (val) => {
            const regex = /(([A-Z]+)([a-z]+)([0-9]+)([!@#$%&?]+))/g;
            return regex.test(val);
        },
    },
    todos: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Todo' }],
});
const login = async function (email, password) {
    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user)
            throw new Error('L Email or Password is incorrect');
        // const isTrue = password === user.password;
        const isTrue = await bcrypt_1.default.compare(password, user.password);
        console.log(isTrue);
        if (!isTrue)
            throw new Error('L Email or Password is incorrect');
        return user;
    }
    catch (err) {
        throw err;
    }
};
exports.login = login;
userSchema.pre('save', async function (next) {
    console.log("We're here");
    const user = await User.findById(this._id);
    console.log(user);
    if (user)
        return next();
    console.log('Continued');
    const salt = await bcrypt_1.default.genSalt(8);
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
userSchema.post('findOneAndDelete', async function (user) {
    const msg = await todo_1.default.deleteMany({ _id: { $in: user.todos } });
    console.log(msg);
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map