import { ApiContext } from "../utils/ApiContext";

export default class ApiEndpointController {
  public readonly endpoint = async (ctx: ApiContext): Promise<void> => {
    ctx.status = 200;
    ctx.body = {
      name: ctx.t("api.greetings"),
      heartbeat: new Date(),
    };
  };
}
