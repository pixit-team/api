import Http, { Server as HttpServer } from "http";

import Koa from "koa";
import KoaBodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import BaseRouter from "../routers/BaseRouter";

import useLoggerMiddleware from "./useLoggerMiddleware";
import useLocalizationMiddleware from "./useLocalizationMiddleware";

export default class Server {
  private readonly koaApp: Koa;

  private readonly httpServer: HttpServer;

  constructor(routers: BaseRouter[]) {
    this.koaApp = new Koa();
    this.koaApp.use(KoaBodyParser());

    this.koaApp.use(cors());

    // Add middlewares
    Server.loadMiddlwares(this.koaApp);

    // Bind routers
    routers.forEach(router => {
      this.koaApp.use(router.routes());
    });

    // Create server
    this.httpServer = Http.createServer(this.koaApp.callback());
  }

  public readonly getServer = (): HttpServer => {
    return this.httpServer;
  };

  public readonly listen = (port: number, callback: () => void): void => {
    this.httpServer.listen(port, callback);
  };

  private static readonly loadMiddlwares = (app: Koa): void => {
    useLoggerMiddleware(app);
    useLocalizationMiddleware(app);
  };
}
