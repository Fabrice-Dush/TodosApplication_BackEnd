import path from 'path';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
const app: Express = express();
import todoRoutes from './routes/todo';
import userRoutes from './routes/user';
import { checkUser, authenticate } from './middleware/middleware';
import { renderHomepage } from './controllers/todos';

dotenv.config();

mongoose
  .connect(process.env.DATABASE)
  .then(msg => console.log('Connected to Database'))
  .catch(err => {
    console.log('Ohhhh NOOOO, ERRRORRRR!!!!');
    console.error(err);
  });

app.use(cors());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('*', checkUser);
app.get('/', authenticate, renderHomepage);

app.use('/', userRoutes);
app.use('/todos', todoRoutes);

app.use(function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(err);
  const errors = {
    fullname: '',
    email: '',
    password: err.message.startsWith('L') ? err.message.slice(1) : '',
  };
  if (err.code === 11000) {
    errors.email = 'Email already taken';
  }
  if (err.name === 'ValidationError') {
    Object.values(err.errors).forEach((properties: any) => {
      const path: any = properties.path;

      if (path === 'fullname') errors.fullname = 'Provide a valid fullname';
      if (path === 'email') errors.email = 'Enter a valid email';
      if (path === 'password')
        errors.password =
          'Password must include letters, numbers and special characters';
    });
  }
  res.status(500).json({ ok: false, message: 'fail', errors });
});

app.listen(3000, () => console.log('App is listening on port 3000'));
