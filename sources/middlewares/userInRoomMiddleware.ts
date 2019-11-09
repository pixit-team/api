import { isRoomMember } from "../core/types/Room";
import ApiRoomContext from "../server/contexts/ApiRoomContext";

export default () => async (
  ctx: ApiRoomContext,
  next: () => Promise<void>,
): Promise<void> => {
  const { requestingUser, room } = ctx.state;

  if (!isRoomMember(room, requestingUser._id)) {
    ctx.throw(403, ctx.t("req.room.forbidden"));
    return;
  }

  await next();
};
