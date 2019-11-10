import { Connection, Document, Model, Schema } from "mongoose";

import Room from "../../core/types/Room";

const SECOND = 1;
const HOUR = 3600 * SECOND;
const ROOM_LIFESPAN = 12 * HOUR;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  members: {
    type: Array,
    required: true,
  },
  playlist: new Schema({
    items: {
      type: Array,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      required: true,
    },
    playingSince: {
      type: Date,
      required: true,
    },
    musicOffset: {
      type: Number,
      required: true,
    },
  }),
  createdAt: {
    type: Date,
    expires: ROOM_LIFESPAN,
    default: Date.now,
  },
});

export type RoomDocument = Room & Document;

export function registerRoomModel(conn: Connection): Model<RoomDocument> {
  return conn.model<RoomDocument>("Room", RoomSchema);
}

export default RoomSchema;
