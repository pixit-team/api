import { ApiRoomContext } from "../server/contexts/ApiRoomContext";

export default () => async (
  ctx: ApiRoomContext,
  next: () => Promise<void>,
): Promise<void> => {
  const { requestingUser, room } = ctx.state;

  if (room.members.findIndex(u => requestingUser._id.equals(u.id)) === -1) {
    ctx.throw(404, ctx.t("req.room.unauthorized"));
    return;
  }

  await next();
};
