import { ObjectId } from "bson";

import PlaylistItem from "./PlaylistItem";
import RoomMember from "./RoomMember";

export default interface Room {
  uuid: string;
  name: string;
  members: RoomMember[];
  playlist: {
    current?: {
      item: PlaylistItem;
      playingSince: Date;
      musicOffset: number; // in milliseconds
    };
    nextItems: PlaylistItem[];
    isPlaying: boolean;
  };
}

export const isRoomMember = (room: Room, memberId: ObjectId): boolean => {
  return !!room.members.find(m => m.id.equals(memberId));
};
