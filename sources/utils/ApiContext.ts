import Koa from "koa";

import { User } from "../models/schemas/UserSchema";

interface ApiContextState {
  requestingUser?: User;
}

export type ApiContext = Koa.ParameterizedContext<ApiContextState>;
