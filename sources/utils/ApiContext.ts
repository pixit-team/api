import Koa from "koa";

import User from "../models/entities/User";

interface ApiContextState {
  requestingUser?: User;
}

export type ApiContext = Koa.ParameterizedContext<ApiContextState>;
