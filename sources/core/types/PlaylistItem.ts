import { ObjectId } from "bson";

export default interface PlaylistItem {
  uuid: string;
  videoId: string;
  title: string;
  img: string;
  addedBy: ObjectId;
}
