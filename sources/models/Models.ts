import { Connection, Model } from "mongoose";

import { UserDocument, registerUserModel } from "./schemas/UserSchema";

export default class Models {
  public readonly userModel: Model<UserDocument>;

  constructor(conn: Connection) {
    this.userModel = registerUserModel(conn);
  }
}
