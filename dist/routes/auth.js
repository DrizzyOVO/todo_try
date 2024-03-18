"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const db_1 = require("../db");
const zod_1 = require("zod");
// import { signupInput } from "../signupZod/index"; 
const signupInput = zod_1.z.object({
    username: zod_1.z.string().max(50).min(5).email(),
    password: zod_1.z.string().min(2)
});
const router = express_1.default.Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.json({
            message: 'Invalid input'
        });
        return;
    }
    const username = parsedInput.data.username;
    const password = parsedInput.data.password;
    const user = yield db_1.User.findOne({ username });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'User already exista ', token });
    }
    else {
        const len = yield db_1.User.find({});
        const length = len.length;
        if (length == 35) {
            yield db_1.User.deleteMany();
            yield db_1.Todo.deleteMany();
            const newUser = new db_1.User({ username, password });
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ id: newUser._id }, middleware_1.SECRET, { expiresIn: '1h' });
            res.json({ message: 'User created successfully', token });
        }
        else {
            const newUser = new db_1.User({ username, password });
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ id: newUser._id }, middleware_1.SECRET, { expiresIn: '1h' });
            res.json({ message: 'User created successfully', token });
        }
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.json({
            message: 'Invalid input'
        });
        return;
    }
    const username = parsedInput.data.username;
    const password = parsedInput.data.password;
    const user = yield db_1.User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
    else {
        res.json({ message: 'Invalid username or password' });
    }
}));
router.get('/me', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const user = yield db_1.User.findOne({ _id: userId });
    if (user) {
        res.json({ username: user.username });
    }
    else {
        res.json({ message: 'User not logged in' });
    }
}));
exports.default = router;
