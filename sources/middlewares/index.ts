import ApiContext from "../server/contexts/ApiContext";
import ApiRoomContext from "../server/contexts/ApiRoomContext";

type Middleware<T> = (ctx: T, next: () => Promise<void>) => Promise<void>;

export default interface Middlewares {
  readonly authenticatedOnly: Middleware<ApiContext>;
  readonly roomExists: Middleware<ApiRoomContext>;
  readonly userInRoom: Middleware<ApiRoomContext>;
}
