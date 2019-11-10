import PlaylistItem from "../core/types/PlaylistItem";
import { RoomDocument } from "../models/schemas/RoomSchema";

export default class RoomView {
  public readonly formatRoom = (room: RoomDocument): object => {
    return {
      uuid: room.uuid,
      name: room.name,
      members: room.members.map(m => ({
        id: m.id,
        name: m.name,
        isConnected: m.isConnected,
      })),
      playlist: {
        items: room.playlist.items.map(RoomView.formatPlaylistItem),
        isPlaying: room.playlist.isPlaying,
        playingSince: room.playlist.playingSince,
        musicOffset: room.playlist.musicOffset,
      },
    };
  };

  private static readonly formatPlaylistItem = (
    playlistItem: PlaylistItem,
  ): object => {
    return {
      videoId: playlistItem.videoId,
      uuid: playlistItem.uuid,
      title: playlistItem.title,
      img: playlistItem.img,
      addedBy: playlistItem.addedBy,
    };
  };
}
