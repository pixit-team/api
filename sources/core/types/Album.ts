import { ObjectId } from "bson";

import AlbumItem from "./AlbumItem";
import AlbumMember from "./AlbumMember";

export default interface Album {
  uuid: string;
  name: string;
  members: AlbumMember[];
  items: AlbumItem[];
}

export const isAlbumMember = (album: Album, memberId: ObjectId): boolean => {
  return !!album.members.find(m => m.id.equals(memberId));
};
