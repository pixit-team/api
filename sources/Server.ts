import Koa from "koa";
import KoaLogger from "koa-logger";

import BaseRouter from "./routers/BaseRouter";

export default class Server {
  private readonly koaApp: Koa;

  constructor(routers: BaseRouter[]) {
    this.koaApp = new Koa();

    // Add middlewares
    this.koaApp.use(KoaLogger());

    // Bind routers
    routers.forEach(router => {
      this.koaApp.use(router.routes());
    });
  }

  public readonly listen = (port: number, callback: () => void): void => {
    this.koaApp.listen(port, callback);
  };
}
