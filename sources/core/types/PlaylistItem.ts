import { ObjectId } from "bson";

export default interface PlaylistItem {
  url: string;
  userId: ObjectId;
}
