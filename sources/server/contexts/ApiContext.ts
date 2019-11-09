import Koa from "koa";

import { UserDocument } from "../../models/schemas/UserSchema";

interface ApiContextState {
  requestingUser: UserDocument;
}

type ApiContext = Koa.ParameterizedContext<ApiContextState>;
export default ApiContext;
