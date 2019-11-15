import ApiContext from "../server/contexts/ApiContext";
import ApiAlbumContext from "../server/contexts/ApiAlbumContext";

type Middleware<T> = (ctx: T, next: () => Promise<void>) => Promise<void>;

export default interface Middlewares {
  readonly authenticatedOnly: Middleware<ApiContext>;
  readonly albumExists: Middleware<ApiAlbumContext>;
  readonly userInAlbum: Middleware<ApiAlbumContext>;
}
