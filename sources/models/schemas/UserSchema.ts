import { Connection, Document, Model, Schema } from "mongoose";

import User from "../../core/types/User";

export type UserDocument = User & Document;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cipheredPassword: {
    type: String,
    required: true,
  },
});

export function registerUserModel(conn: Connection): Model<UserDocument> {
  return conn.model<UserDocument>("User", UserSchema);
}

export default UserSchema;
