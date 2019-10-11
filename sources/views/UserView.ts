import { UserDocument } from "../models/schemas/UserSchema";

export default class UserView {
  public readonly formatPrivateUser = (user: UserDocument): object => {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  };

  public readonly formatPublicUser = (user: UserDocument): object => {
    return {
      id: user._id,
      name: user.name,
    };
  };
}
