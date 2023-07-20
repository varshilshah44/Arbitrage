import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const validator = require("validator");

export interface User extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      trim: true,
      lowercase: true, //it is not a validator, it will convert the letters to lowercase
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.methods.verifyPassword = async function (
  toVerify: string,
  verifyWith: string
): Promise<boolean> {
  return await bcrypt.compare(toVerify, verifyWith);
};

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
