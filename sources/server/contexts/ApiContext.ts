import Koa from "koa";

import { UserDocument } from "../../models/schemas/UserSchema";

interface ApiContextState {
  requestingUser: UserDocument;
}

export type ApiContext = Koa.ParameterizedContext<ApiContextState>;
