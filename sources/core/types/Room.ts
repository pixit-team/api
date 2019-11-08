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
