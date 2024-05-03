"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHomepage = exports.markCompleted = exports.deleteTodos = exports.deleteTodo = exports.editTodo = exports.getTodo = exports.getTodoForm = exports.createTodosPost = exports.createTodos = void 0;
const todo_1 = __importDefault(require("./../models/todo"));
const user_1 = __importDefault(require("./../models/user"));
const createTodos = function (req, res, next) {
    res.status(200).json({ ok: true, message: 'success', data: {} });
};
exports.createTodos = createTodos;
const createTodosPost = async function (req, res, next) {
    try {
        const { text } = req.body;
        const todo = new todo_1.default({ text });
        const user = req.body.authenticatedUser;
        todo.user = user;
        await todo.save();
        const todos = [...user.todos, todo];
        const updatedUser = await user_1.default.findByIdAndUpdate(user.id, { todos }, {
            new: true,
            runValidators: true,
        });
        res.status(201).json({
            ok: true,
            message: 'success',
            data: { text: todo.text, completed: todo.completed },
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, message: 'fail', errors: err });
    }
};
exports.createTodosPost = createTodosPost;
const getTodoForm = async function (req, res, next) {
    try {
        const todo = await todo_1.default.findById(req.params.id);
        if (!todo)
            throw new Error('No todo found');
        res.status(200).json({ ok: true, message: 'success', data: todo });
    }
    catch (err) {
        next(err);
    }
};
exports.getTodoForm = getTodoForm;
const getTodo = async function (req, res, next) {
    try {
        const todo = await todo_1.default.findById(req.params.id);
        if (!todo)
            throw new Error('Todo not found');
        res.status(200).json({ ok: true, message: 'success', data: todo });
    }
    catch (err) {
        res.status(500).json({ ok: false, message: 'fail', errors: err });
    }
};
exports.getTodo = getTodo;
const editTodo = async function (req, res, next) {
    try {
        const { id } = req.params;
        const { text: todoText } = req.body;
        const todo = await todo_1.default.findByIdAndUpdate(id, { text: todoText }, { new: true, runValidators: true });
        res.status(200).json({ ok: true, message: 'success', data: todo });
    }
    catch (err) {
        res.status(500).json({ ok: false, message: 'fail', errors: err });
    }
};
exports.editTodo = editTodo;
const deleteTodo = async function (req, res, next) {
    try {
        const { id } = req.params;
        const todo = await todo_1.default.findByIdAndDelete(id).populate('user');
        const user = todo.user;
        const updatedUser = await user_1.default.findByIdAndUpdate(user.id, { $pull: { todos: id } }, { new: true, runValidators: true });
        res
            .status(200)
            .json({ ok: true, message: 'success', data: updatedUser.todos });
    }
    catch (err) {
        res.status(500).json({ ok: false, message: 'fail', errors: err });
    }
};
exports.deleteTodo = deleteTodo;
const deleteTodos = async function (req, res, next) {
    try {
        const user = await user_1.default.findOne({
            fullname: req.body.authenticatedUser.fullname,
        });
        //? Deleting todos from Todo model
        const msg = await todo_1.default.deleteMany({ _id: { $in: user.todos } });
        //? Deleting todos ids from User model
        const todos = [];
        const updatedUser = await user_1.default.findByIdAndUpdate(user.id, { todos }, { new: true, runValidators: true });
        res
            .status(200)
            .json({ ok: true, message: 'success', data: updatedUser.todos });
    }
    catch (err) {
        res.status(500).json({ ok: false, message: 'fail', errors: err });
    }
};
exports.deleteTodos = deleteTodos;
const markCompleted = async function (req, res, next) {
    try {
        const todo = await todo_1.default.findById(req.params.id);
        const updatedTodo = await todo_1.default.findByIdAndUpdate(todo.id, { completed: !todo.completed }, { new: true, runValidators: true });
        res.status(200).json({ ok: true, message: 'success', data: updatedTodo });
    }
    catch (err) {
        res.status(500).json({ ok: false, message: 'fail', errors: err });
    }
};
exports.markCompleted = markCompleted;
const renderHomepage = async function (req, res, next) {
    try {
        const user = await user_1.default.findById(req.body.authenticatedUser?.id).populate('todos');
        const todos = user.todos;
        res.status(200).json({ ok: true, message: 'success', data: todos });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            message: 'fail',
            errors: err,
        });
    }
};
exports.renderHomepage = renderHomepage;
//# sourceMappingURL=todos.js.map