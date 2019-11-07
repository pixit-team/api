import { Connection, Model } from "mongoose";

import { RoomDocument, registerRoomModel } from "./schemas/RoomSchema";
import { UserDocument, registerUserModel } from "./schemas/UserSchema";

export default class Models {
  public readonly roomModel: Model<RoomDocument>;

  public readonly userModel: Model<UserDocument>;

  constructor(conn: Connection) {
    this.roomModel = registerRoomModel(conn);
    this.userModel = registerUserModel(conn);
  }
}
