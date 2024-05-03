import express from 'express';
import {
  createTodos,
  getTodo,
  getTodoForm,
  editTodo,
  deleteTodo,
  markCompleted,
  renderHomepage,
  createTodosPost,
  deleteTodos,
} from './../controllers/todos';
import { authenticate } from './../middleware/middleware';

const router = express.Router();

router
  .route('/')
  .get(authenticate, renderHomepage)
  .post(authenticate, createTodosPost);

router.get('/new', createTodos);
router.delete('/deleteAll', authenticate, deleteTodos);
router
  .route('/:id')
  .get(authenticate, getTodo)
  .put(authenticate, editTodo)
  .patch(authenticate, markCompleted)
  .delete(authenticate, deleteTodo);

router.get('/:id/edit', authenticate, getTodoForm);

export default router;
