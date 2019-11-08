import Uuid from "uuid/v4";

import Repositories from "../models/repositories";
import { ApiContext } from "../server/contexts/ApiContext";
import { ApiRoomContext } from "../server/contexts/ApiRoomContext";
import Room from "../core/types/Room";
import Views from "../views";

export default class RoomController {
  private readonly repositories: Repositories;

  private readonly views: Views;

  constructor(repositories: Repositories, views: Views) {
    this.repositories = repositories;
    this.views = views;
  }

  public readonly createRoom = async (ctx: ApiContext): Promise<void> => {
    const roomName: string =
      ctx.request.body.name ||
      ctx.throw(400, ctx.t("req.room.field.name.missing"));

    const room: Room = {
      uuid: Uuid(),
      name: roomName,
      members: [],
      playlist: {
        current: undefined,
        nextItems: [],
        isPlaying: false,
      },
    };

    this.repositories.roomRepository.create(room);

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      room,
    };
  };

  public readonly getRooms = async (ctx: ApiContext): Promise<void> => {
    const rooms = await this.repositories.roomRepository.getAll();

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      rooms,
    };
  };

  public readonly getRoom = async (ctx: ApiContext): Promise<void> => {
    const roomUuid: string =
      ctx.params.uuid || ctx.throw(400, ctx.t("req.room.field.uuid.missing"));

    const room = await this.repositories.roomRepository.findOneByUuid(roomUuid);

    if (!room) {
      ctx.throw(404, ctx.t("req.room.notFound"));
      return;
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      room: this.views.roomView.formatPrivateRoom(room),
    };
  };

  public readonly joinRoom = async (ctx: ApiContext): Promise<void> => {
    const { requestingUser } = ctx.state;

    const roomUuid: string =
      ctx.params.uuid || ctx.throw(400, ctx.t("req.room.field.uuid.missing"));

    const room = await this.repositories.roomRepository.findOneByUuid(roomUuid);
    if (!room) {
      ctx.throw(404, ctx.t("req.room.notFound"));
      return;
    }

    // We add the user only if he isn't there
    if (room.members.findIndex(u => requestingUser._id.equals(u.id)) === -1) {
      await this.repositories.roomRepository.addUser(room, {
        id: requestingUser._id,
        name: requestingUser.name,
        isConnected: true,
      });
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      room: this.views.roomView.formatPrivateRoom(room),
    };
  };

  public readonly musicAdd = async (ctx: ApiRoomContext): Promise<void> => {
    const videoId: string =
      ctx.request.body.video_id ||
      ctx.throw(400, ctx.t("req.room.musicAdd.videoId.missing"));

    await this.repositories.roomRepository.addMusic(ctx.state.room, {
      videoId,
      uuid: Uuid(),
      addedBy: ctx.state.requestingUser._id,
    });

    // TODO SERVER_BROADCAST: “music_add” -> {PlaylistItem}

    ctx.status = 200;
    ctx.body = {
      message: "OK",
    };
  };
}
