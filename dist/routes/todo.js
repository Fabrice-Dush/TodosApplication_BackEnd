"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todos_1 = require("./../controllers/todos");
const middleware_1 = require("./../middleware/middleware");
const router = express_1.default.Router();
router
    .route('/')
    .get(middleware_1.authenticate, todos_1.renderHomepage)
    .post(middleware_1.authenticate, todos_1.createTodosPost);
router.get('/new', todos_1.createTodos);
router.delete('/deleteAll', middleware_1.authenticate, todos_1.deleteTodos);
router
    .route('/:id')
    .get(middleware_1.authenticate, todos_1.getTodo)
    .put(middleware_1.authenticate, todos_1.editTodo)
    .patch(middleware_1.authenticate, todos_1.markCompleted)
    .delete(middleware_1.authenticate, todos_1.deleteTodo);
router.get('/:id/edit', middleware_1.authenticate, todos_1.getTodoForm);
exports.default = router;
//# sourceMappingURL=todo.js.map