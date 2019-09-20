import { Context } from "koa";

export default class ApiEndpointController {

    public readonly endpoint = async (ctx: Context): Promise<void> => {
        ctx.status = 200;
        ctx.body = {
            name: "melosync API",
            heartbeat: new Date(),
        };
    };
}
