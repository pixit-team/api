import { ApiContext } from "../server/contexts/ApiContext";
import Views from "../views";

export default class UserController {
  private readonly views: Views;

  constructor(views: Views) {
    this.views = views;
  }

  public readonly personalInfo = async (ctx: ApiContext): Promise<void> => {
    const { requestingUser } = ctx.state;
    if (!requestingUser) {
      ctx.throw(401, ctx.t("req.auth.required"));
      return;
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      user: this.views.userView.formatPrivateUser(requestingUser),
    };
  };
}
