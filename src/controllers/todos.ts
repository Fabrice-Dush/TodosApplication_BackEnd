import { NextFunction, Request, Response } from 'express';
import Todo, { todoInterface } from './../models/todo';
import User from './../models/user';
import { CLIENT_RENEG_LIMIT } from 'tls';

export const createTodos = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({ ok: true, message: 'success', data: {} });
};

export const createTodosPost = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { text } = req.body;
    const todo = new Todo({ text });
    const user = req.body.authenticatedUser;
    todo.user = user;
    await todo.save();
    const todos = [...user.todos, todo];
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { todos },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({
      ok: true,
      message: 'success',
      data: { text: todo.text, completed: todo.completed },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, message: 'fail', errors: err });
  }
};

export const getTodoForm = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) throw new Error('No todo found');
    res.status(200).json({ ok: true, message: 'success', data: todo });
  } catch (err) {
    next(err);
  }
};

export const getTodo = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) throw new Error('Todo not found');
    res.status(200).json({ ok: true, message: 'success', data: todo });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'fail', errors: err });
  }
};

export const editTodo = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { text: todoText } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      id,
      { text: todoText },
      { new: true, runValidators: true }
    );

    res.status(200).json({ ok: true, message: 'success', data: todo });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'fail', errors: err });
  }
};

export const deleteTodo = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id).populate('user');
    const user = todo.user;
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $pull: { todos: id } },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ ok: true, message: 'success', data: updatedUser.todos });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'fail', errors: err });
  }
};

export const deleteTodos = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findOne({
      fullname: req.body.authenticatedUser.fullname,
    });

    //? Deleting todos from Todo model
    const msg = await Todo.deleteMany({ _id: { $in: user.todos } });

    //? Deleting todos ids from User model

    const todos: todoInterface[] = [];
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { todos },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ ok: true, message: 'success', data: updatedUser.todos });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'fail', errors: err });
  }
};

export const markCompleted = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const todo = await Todo.findById(req.params.id);
    const updatedTodo = await Todo.findByIdAndUpdate(
      todo.id,
      { completed: !todo.completed },
      { new: true, runValidators: true }
    );
    res.status(200).json({ ok: true, message: 'success', data: updatedTodo });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'fail', errors: err });
  }
};

export const renderHomepage = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findById(req.body.authenticatedUser?.id).populate(
      'todos'
    );
    const todos = user.todos;
    res.status(200).json({ ok: true, message: 'success', data: todos });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'fail',
      errors: err,
    });
  }
};
