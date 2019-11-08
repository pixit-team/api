import { ObjectId } from "bson";

export default interface PlaylistItem {
  videoId: string;
  uuid: string;
  addedBy: ObjectId;
}
