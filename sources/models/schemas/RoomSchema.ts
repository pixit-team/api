import { Connection, Document, Model, Schema } from "mongoose";
import { ObjectId } from "bson";

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
    required: true,
    trim: true,
  },
  members: {
    type: Array,
    required: true,
  },
  playlist: new Schema({
    current: new Schema({
      item: new Schema({
        videoId: {
          type: String,
          required: true,
        },
        uuid: {
          type: String,
          required: true,
        },
        addedBy: {
          type: ObjectId,
          required: true,
        },
      }),
      playingSince: {
        type: Date,
        required: true,
      },
      musicOffset: {
        type: Number,
        required: true,
      },
    }),
    nextItems: {
      type: Array,
      required: true,
    },
  }),
});

export function registerRoomModel(conn: Connection): Model<RoomDocument> {
  return conn.model<RoomDocument>("Room", RoomSchema);
}

export default RoomSchema;
