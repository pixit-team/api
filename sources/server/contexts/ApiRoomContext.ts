import Koa from "koa";

import { RoomDocument } from "../../models/schemas/RoomSchema";
import { UserDocument } from "../../models/schemas/UserSchema";

interface ApiRoomContextState {
  requestingUser: UserDocument;
  room: RoomDocument;
}

type ApiRoomContext = Koa.ParameterizedContext<ApiRoomContextState>;
export default ApiRoomContext;
