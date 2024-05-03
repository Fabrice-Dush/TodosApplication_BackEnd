import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import Todo from './todo';
const { isEmail } = validator;

export interface userInterface {
  salt: string;
  fullname: string;
  email: string;
  password: string;
  username: string;
  todos: [{ id: Schema.Types.ObjectId }];
}

const userSchema = new Schema({
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
    validate: (val: string): Boolean => {
      const regex = /(([A-Z]+)([a-z]+)([0-9]+)([!@#$%&?]+))/g;
      return regex.test(val);
    },
  },
  todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }],
});

export const login = async function (email: string, password: string) {
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) throw new Error('L Email or Password is incorrect');
    // const isTrue = password === user.password;
    const isTrue = await bcrypt.compare(password, user.password);
    console.log(isTrue);
    if (!isTrue) throw new Error('L Email or Password is incorrect');
    return user;
  } catch (err) {
    throw err;
  }
};

userSchema.pre('save', async function (next) {
  console.log("We're here");
  const user = await User.findById(this._id);
  console.log(user);
  if (user) return next();
  console.log('Continued');
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post('findOneAndDelete', async function (user) {
  const msg = await Todo.deleteMany({ _id: { $in: user.todos } });
  console.log(msg);
});

const User = mongoose.model('User', userSchema);
export default User;
