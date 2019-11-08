import Repositories from "../models/repositories";
import { ApiRoomContext } from "../server/contexts/ApiRoomContext";

export default (repositories: Repositories) => async (
  ctx: ApiRoomContext,
  next: () => Promise<void>,
): Promise<void> => {
  // Get room uuid from params
  const roomUuid: string =
    ctx.params.uuid || ctx.throw(400, ctx.t("req.room.field.uuid.missing"));

  // Make sure the room exists
  const room = await repositories.roomRepository.findOneByUuid(roomUuid);
  if (!room) {
    ctx.throw(404, ctx.t("req.room.notFound"));
    return;
  }

  // Add room to state
  ctx.state.room = room;

  await next();
};
