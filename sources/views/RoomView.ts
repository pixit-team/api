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
        is_connected: m.isConnected,
      })),
      playlist: {
        current: RoomView.formatPlaylistCurrent(room.playlist.current),
        next_items: room.playlist.nextItems.map(RoomView.formatPlaylistItem),
        is_playing: room.playlist.isPlaying,
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
      playing_since: current.playingSince,
      music_offset: current.musicOffset,
    };
  };

  private static readonly formatPlaylistItem = (
    playlistItem: PlaylistItem,
  ): object => {
    return {
      video_id: playlistItem.videoId,
      uuid: playlistItem.uuid,
      added_by: playlistItem.addedBy,
    };
  };
}

type CurrentItem = {
  item: PlaylistItem;
  playingSince: Date;
  musicOffset: number;
};
