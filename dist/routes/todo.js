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
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const db_1 = require("../db");
const router = express_1.default.Router();
router.post('/todos', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const done = false;
    const userId = req.headers["userId"];
    const len = yield db_1.Todo.find({ userId: userId });
    const length = len.length;
    if (length == 10) {
        res.json({ message: "Todo limit reached" });
    }
    else {
        const newTodo = new db_1.Todo({ title, done, userId });
        yield newTodo.save()
            .then((savedTodo) => {
            res.status(201).json({ todos: savedTodo });
        })
            .catch((err) => {
            res.status(500).json({ error: 'Failed to create a new todo' });
        });
    }
}));
router.get('/todos', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const todos = yield db_1.Todo.find({ userId: userId });
    if (todos) {
        res.json({ todos });
    }
    else {
        res.status(403).json({ error: "Failed to retrieve todos" });
    }
    // arr.push(todos[0]); 
    // if(arr) { 
    //     res.json(todos); 
    // } else { 
    //     res.status(403).json({ error: "Failed to retrieve todos" }); 
    // }
    // Todo.find({ userId })
    // .then((todos) => {
    //     console.log(todos);
    //   res.json(todos);
    // })
    // .catch((err) => {
    //   res.status(500).json({ error: 'Failed to retrieve todos' });
    // });
}));
router.patch('/todos/:todoId/done', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todoId } = req.params;
    const userId = req.headers["userId"];
    const updatedTodo = yield db_1.Todo.findById({ _id: todoId });
    if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not founc" });
    }
    else {
        if (updatedTodo.done) {
            updatedTodo.done = false;
        }
        else {
            updatedTodo.done = true;
        }
        yield updatedTodo.save();
        res.json({ updatedTodo });
    }
    // await Todo.findOneAndUpdate({ _id: todoId },  { done: (true) ? false : true }) 
    //     .then((updateTodo) => {
    //         if(!updateTodo) { 
    //             return res.status(404).json({ error : "Todo not found"}); 
    //         }
    //         res.json({ updateTodo }); 
    //     })
    //     .catch((err) => { 
    //         res.status(500).json({ error: 'Failed to update todo '}); 
    //     }); 
}));
router.post("/todos/:todoId/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todoId } = req.params;
    const userId = req.headers["userId"];
    const deleteTodo = yield db_1.Todo.findByIdAndDelete({ _id: todoId });
    if (!deleteTodo) {
        return res.status(404).json({ error: "Todo not founc" });
    }
    else {
        res.json({ deleteTodo });
    }
}));
exports.default = router;
