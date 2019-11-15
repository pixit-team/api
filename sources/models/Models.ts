import { Connection, Model } from "mongoose";

import { AlbumDocument, registerAlbumModel } from "./schemas/AlbumSchema";
import { UserDocument, registerUserModel } from "./schemas/UserSchema";

export default class Models {
  public readonly albumModel: Model<AlbumDocument>;

  public readonly userModel: Model<UserDocument>;

  constructor(conn: Connection) {
    this.albumModel = registerAlbumModel(conn);
    this.userModel = registerUserModel(conn);
  }
}
