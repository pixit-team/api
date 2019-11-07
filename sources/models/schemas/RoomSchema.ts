import { Connection, Document, Model, Schema } from "mongoose";

import Room from "../../core/types/Room";

export type RoomDocument = Room & Document;

const RoomSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: false,
    trim: true,
  },
  users: {
    type: Array,
    required: true,
  },
  playlist: {
    type: Array,
    required: true,
  },
});

export function registerRoomModel(conn: Connection): Model<RoomDocument> {
  return conn.model<RoomDocument>("Room", RoomSchema);
}

export default RoomSchema;
