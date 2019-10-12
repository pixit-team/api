import { ApiContext } from "../utils/ApiContext";
import Repositories from "../models/repositories";
import Services from "../services";

const BEARER = "Bearer ";

export default (repositories: Repositories, services: Services) => async (
  ctx: ApiContext,
  next: () => Promise<void>,
): Promise<void> => {
  // Retrieve "authorization" header
  const authorization = ctx.request.headers.authorization as string;
  if (!authorization) {
    ctx.throw(401, ctx.t("req.auth.required"));
    return;
  }

  // Make sure it respects the "Bearer" format
  if (!authorization.startsWith(BEARER)) {
    ctx.throw(401, ctx.t("req.auth.invalidBearer"));
    return;
  }

  // Parse token
  const token = authorization.substring(BEARER.length);
  const payload = services.jwtService.decode(token) as { id: string };
  if (!payload || !payload.id) {
    ctx.throw(401, ctx.t("req.auth.invalidToken"));
    return;
  }

  // Retrieve corresponding User
  const user = await repositories.userRepository.findOneById(payload.id);
  if (!user) {
    ctx.throw(401, ctx.t("req.auth.invalidToken"));
    return;
  }

  // Add authenticated User to state
  ctx.state.requestingUser = user;

  await next();
};
