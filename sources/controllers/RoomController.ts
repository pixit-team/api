import Uuid from "uuid/v4";

import { isRoomMember } from "../core/types/Room";
import Repositories from "../models/repositories";
import ApiContext from "../server/contexts/ApiContext";
import ApiRoomContext from "../server/contexts/ApiRoomContext";
import Views from "../views";

export default class RoomController {
  private readonly repositories: Repositories;

  private readonly views: Views;

  constructor(repositories: Repositories, views: Views) {
    this.repositories = repositories;
    this.views = views;
  }

  public readonly createRoom = async (ctx: ApiContext): Promise<void> => {
    // Create new Room
    const createdRoom = await this.repositories.roomRepository.create({
      uuid: Uuid(),
      name: ctx.t("room.field.name.default"),
      members: [],
      playlist: {
        current: undefined,
        nextItems: [],
        isPlaying: false,
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
      updatedRoom = await this.repositories.roomRepository.addUser(room, {
        id: requestingUser._id,
        name: requestingUser.name,
        isConnected: false,
      });
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      room: this.views.roomView.formatRoom(updatedRoom),
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
