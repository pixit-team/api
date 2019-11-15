import { ObjectId } from "bson";

export default interface AlbumItem {
  uuid: string;
  img: string;
  addedBy: ObjectId;
}
