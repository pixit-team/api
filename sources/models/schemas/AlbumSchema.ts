import { Connection, Document, Model, Schema } from "mongoose";

import Album from "../../core/types/Album";

const AlbumSchema = new Schema({
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
  items: {
    type: Array,
    required: true,
  },
});

export type AlbumDocument = Album & Document;

export function registerAlbumModel(conn: Connection): Model<AlbumDocument> {
  return conn.model<AlbumDocument>("Album", AlbumSchema);
}

export default AlbumSchema;
