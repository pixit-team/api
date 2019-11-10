import Uuid from "uuid/v4";

import PlaylistItem from "../core/types/PlaylistItem";
import { isRoomMember } from "../core/types/Room";
import RoomMember from "../core/types/RoomMember";
import Repositories from "../models/repositories";
import ApiContext from "../server/contexts/ApiContext";
import ApiRoomContext from "../server/contexts/ApiRoomContext";
import Services from "../services";
import Views from "../views";

const DEFAULT_PLAYLIST_ITEM = {
  videoId: "Hy8kmNEo1i8",
  title: "Scatman (ski-ba-bop-ba-dop-bop) Official Video HD -Scatman John",
  img: "https://i.ytimg.com/vi/Hy8kmNEo1i8/hqdefault.jpg",
};

export default class RoomController {
  private readonly repositories: Repositories;

  private readonly services: Services;

  private readonly views: Views;

  constructor(repositories: Repositories, services: Services, views: Views) {
    this.repositories = repositories;
    this.services = services;
    this.views = views;
  }

  public readonly createRoom = async (ctx: ApiContext): Promise<void> => {
    const { requestingUser } = ctx.state;

    // Create new Room
    const createdRoom = await this.repositories.roomRepository.create({
      uuid: Uuid(),
      name: ctx.t("room.field.name.default"),
      members: [],
      playlist: {
        items: [
          {
            ...DEFAULT_PLAYLIST_ITEM,
            uuid: Uuid(),
            addedBy: requestingUser._id,
          },
        ],
        isPlaying: false,
        playingSince: new Date(),
        musicOffset: 0,
      },
    });

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      room: this.views.roomView.formatRoom(createdRoom),
    };
  };

  // TODO: REMOVE (here for debug purpose)
  public readonly getRooms = async (ctx: ApiContext): Promise<void> => {
    const rooms = await this.repositories.roomRepository.getAll();

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      rooms,
    };
  };

  public readonly joinRoom = async (ctx: ApiRoomContext): Promise<void> => {
    const { requestingUser, room } = ctx.state;

    // If the User is not already part of the Room, we add him in
    let updatedRoom = room;
    if (!isRoomMember(room, requestingUser._id)) {
      const newMember: RoomMember = {
        id: requestingUser._id,
        name: requestingUser.name,
        isConnected: false,
      };
      updatedRoom = await this.repositories.roomRepository.addUser(
        room,
        newMember,
      );

      await this.services.socketService.broadcastRoom<RoomMember>(
        room.uuid,
        "user_join",
        newMember,
      );
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      room: this.views.roomView.formatRoom(updatedRoom),
    };
  };

  public readonly musicAdd = async (ctx: ApiRoomContext): Promise<void> => {
    const { requestingUser, room } = ctx.state;

    // Validate request's parameters
    const musicId: string =
      ctx.request.body.video_id ||
      ctx.throw(400, ctx.t("req.room.musicAdd.videoId.missing"));
    const musicTitle: string =
      ctx.request.body.title ||
      ctx.throw(400, ctx.t("req.room.musicAdd.videoTitle.missing"));
    const musicImg: string =
      ctx.request.body.img ||
      ctx.throw(400, ctx.t("req.room.musicAdd.videoImg.missing"));

    // Create new Music
    const newMusic: PlaylistItem = {
      videoId: musicId,
      uuid: Uuid(),
      title: musicTitle,
      img: musicImg,
      addedBy: requestingUser._id,
    };

    if (room.playlist.items.length === 0) {
      // If this is the first song of the list, reset playlist
      room.playlist = {
        items: [newMusic],
        isPlaying: room.playlist.isPlaying,
        playingSince: room.playlist.playingSince,
        musicOffset: 0,
      };
    } else {
      // Add it to the existing list
      room.playlist.items = [...room.playlist.items, newMusic];
    }

    await this.repositories.roomRepository.saveRoom(room);

    // Broadcast to Room
    await this.services.socketService.broadcastRoom<PlaylistItem>(
      room.uuid,
      "music_add",
      newMusic,
    );

    ctx.status = 200;
    ctx.body = {
      message: "OK",
    };
  };

  public readonly musicPlay = async (ctx: ApiRoomContext): Promise<void> => {
    const { room } = ctx.state;

    if (room.playlist.items.length === 0) {
      ctx.throw(400, "req.room.musicPlay.empty");
      return;
    }

    if (!room.playlist.isPlaying) {
      // Update Playlist state
      room.playlist = {
        items: room.playlist.items,
        isPlaying: true,
        playingSince: new Date(),
        musicOffset: room.playlist.musicOffset,
      };
      await this.repositories.roomRepository.saveRoom(room);

      // Broadcast to Room
      await this.services.socketService.broadcastRoom(room.uuid, "music_start");
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
    };
  };

  public readonly musicPause = async (ctx: ApiRoomContext): Promise<void> => {
    const { room } = ctx.state;

    if (room.playlist.items.length === 0) {
      ctx.throw(400, "req.room.musicPause.empty");
      return;
    }

    if (room.playlist.isPlaying) {
      // Update Playlist state
      const now = new Date();
      const newOffset = now.getTime() - room.playlist.playingSince.getTime();
      room.playlist = {
        items: room.playlist.items,
        isPlaying: false,
        playingSince: room.playlist.playingSince,
        musicOffset: room.playlist.musicOffset + newOffset,
      };
      await this.repositories.roomRepository.saveRoom(room);

      // Broadcast to Room
      await this.services.socketService.broadcastRoom(room.uuid, "music_pause");
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
    };
  };

  public readonly musicNext = async (ctx: ApiRoomContext): Promise<void> => {
    const { room } = ctx.state;

    // Validate request's parameters
    const musicUuid: string =
      ctx.request.body.uuid ||
      ctx.throw(400, ctx.t("req.room.musicNext.uuid.missing"));

    if (room.playlist.items.length === 0) {
      ctx.throw(400, "req.room.musicNext.empty");
      return;
    }

    // Update only if the next element matches the given uuid
    room.playlist.items.shift();
    if (
      room.playlist.items.length > 0 &&
      room.playlist.items[0].uuid === musicUuid
    ) {
      // Update Playlist state
      room.playlist = {
        items: [...room.playlist.items],
        isPlaying: true,
        playingSince: new Date(),
        musicOffset: 0,
      };
      await this.repositories.roomRepository.saveRoom(room);

      // Broadcast to Room
      await this.services.socketService.broadcastRoom(room.uuid, "music_next");
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
    };
  };
}
