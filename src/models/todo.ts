import mongoose, { Schema } from "mongoose";

export interface todoInterface {
  text: string;
  completed: boolean;
  user: Schema.Types.ObjectId;
}

const todoSchema = new Schema({
  text: {
    type: String,
    required: [true, "Todo text is required"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
