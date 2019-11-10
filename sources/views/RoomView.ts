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
        current: RoomView.formatPlaylistCurrent(room.playlist.current),
        nextItems: room.playlist.nextItems.map(RoomView.formatPlaylistItem),
        isPlaying: room.playlist.isPlaying,
      },
    };
  };

  private static readonly formatPlaylistCurrent = (
    current?: CurrentItem,
  ): object | null => {
    if (!current) {
      return null;
    }

    return {
      item: RoomView.formatPlaylistItem(current.item),
      playingSince: current.playingSince,
      musicOffset: current.musicOffset,
    };
  };

  private static readonly formatPlaylistItem = (
    playlistItem: PlaylistItem,
  ): object => {
    return {
      videoId: playlistItem.videoId,
      uuid: playlistItem.uuid,
      addedBy: playlistItem.addedBy,
    };
  };
}

type CurrentItem = {
  item: PlaylistItem;
  playingSince: Date;
  musicOffset: number;
};
