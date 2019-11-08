import { ObjectId } from "bson";

export default interface RoomMember {
  id: ObjectId;
  name: string;
  isConnected: boolean;
}
