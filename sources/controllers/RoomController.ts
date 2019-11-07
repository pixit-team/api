import Uuid from "uuid/v4";

import Repositories from "../models/repositories";
import { ApiContext } from "../utils/ApiContext";
import Room from "../core/types/Room";

export default class RoomController {
  private readonly repositories: Repositories;

  constructor(repositories: Repositories) {
    this.repositories = repositories;
  }

  public readonly createRoom = async (ctx: ApiContext): Promise<void> => {
    const roomName: string =
      ctx.request.body.name ||
      ctx.throw(400, ctx.t("req.room.field.name.missing"));

    const room: Room = {
      uuid: Uuid(),
      name: roomName,
      users: [],
      playlist: [],
    };
    this.repositories.roomRepository.create(room);

    ctx.status = 200;
    ctx.body = {
      message: "OK",
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
}
