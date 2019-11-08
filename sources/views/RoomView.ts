import { RoomDocument } from "../models/schemas/RoomSchema";

export default class RoomView {
  public readonly formatPrivateRoom = (room: RoomDocument): object => {
    return {
      uuid: room.uuid,
      name: room.name,
      members: room.members,
      playlist: room.playlist,
    };
  };
}
