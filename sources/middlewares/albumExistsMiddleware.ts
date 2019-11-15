import Repositories from "../models/repositories";
import ApiAlbumContext from "../server/contexts/ApiAlbumContext";

export default (repositories: Repositories) => async (
  ctx: ApiAlbumContext,
  next: () => Promise<void>,
): Promise<void> => {
  // Get album uuid from params
  const { albumUuid } = ctx.params;
  if (!albumUuid) {
    ctx.throw(400, ctx.t("req.album.field.uuid.missing"));
    return;
  }

  // Make sure the album exists
  const album = await repositories.albumRepository.findOneByUuid(albumUuid);
  if (!album) {
    ctx.throw(404, ctx.t("req.album.notFound"));
    return;
  }

  // Add album to state
  ctx.state.album = album;

  await next();
};
