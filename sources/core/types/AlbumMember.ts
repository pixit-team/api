import { ObjectId } from "bson";

export default interface AlbumMember {
  id: ObjectId;
  name: string;
  email: string;
}
