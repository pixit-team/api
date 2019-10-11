import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  email: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
});

export default mongoose.model<User>("User", UserSchema);
