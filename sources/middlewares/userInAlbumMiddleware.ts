import ApiAlbumContext from "../server/contexts/ApiAlbumContext";
import { isAlbumMember } from "../core/types/Album";

export default () => async (
  ctx: ApiAlbumContext,
  next: () => Promise<void>,
): Promise<void> => {
  const { requestingUser, album } = ctx.state;

  if (!isAlbumMember(album, requestingUser._id)) {
    ctx.throw(403, ctx.t("req.album.forbidden"));
    return;
  }

  await next();
};
