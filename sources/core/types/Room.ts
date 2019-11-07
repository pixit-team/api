import User from "./User";
import PlaylistItem from "./PlaylistItem";

export default interface Room {
  uuid: string;
  name: string;
  users: User[];
  playlist: PlaylistItem[];
}
