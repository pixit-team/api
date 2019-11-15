import Koa from "koa";

import { AlbumDocument } from "../../models/schemas/AlbumSchema";
import { UserDocument } from "../../models/schemas/UserSchema";

interface ApiAlbumContextState {
  requestingUser: UserDocument;
  album: AlbumDocument;
}

type ApiAlbumContext = Koa.ParameterizedContext<ApiAlbumContextState>;
export default ApiAlbumContext;
