import { ObjectId } from "bson";

import PlaylistItem from "./PlaylistItem";
import RoomMember from "./RoomMember";

export default interface Room {
  uuid: string;
  name: string;
  members: RoomMember[];
  playlist: {
    items: PlaylistItem[];
    isPlaying: boolean;
    playingSince: Date;
    musicOffset: number; // in milliseconds
  };
}

export const isRoomMember = (room: Room, memberId: ObjectId): boolean => {
  return !!room.members.find(m => m.id.equals(memberId));
};
