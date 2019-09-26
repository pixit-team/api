import Koa from "koa";

import BaseRouter from "../routers/BaseRouter";

import useLoggerMiddleware from "./useLoggerMiddleware";
import useLocalizationMiddleware from "./useLocalizationMiddleware";

export default class Server {
  private readonly koaApp: Koa;

  constructor(routers: BaseRouter[]) {
    this.koaApp = new Koa();

    // Add middlewares
    Server.loadMiddlwares(this.koaApp);

    // Bind routers
    routers.forEach(router => {
      this.koaApp.use(router.routes());
    });
  }

  public readonly listen = (port: number, callback: () => void): void => {
    this.koaApp.listen(port, callback);
  };

  private static readonly loadMiddlwares = (app: Koa): void => {
    useLoggerMiddleware(app);
    useLocalizationMiddleware(app);
  };
}
