import i18next from "i18next";
import i18nextSyncBackend from "i18next-sync-fs-backend";
import Koa from "koa";
import KoaI18next from "koa-i18next";
import KoaLogger from "koa-logger";

import BaseRouter from "./routers/BaseRouter";

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
    Server.loadLoggerMiddleware(app);
    Server.loadLocalizationMiddleware(app);
  };

  private static readonly loadLoggerMiddleware = (app: Koa): void => {
    app.use(KoaLogger());
  };

  private static readonly loadLocalizationMiddleware = (app: Koa): void => {
    i18next.use(i18nextSyncBackend).init({
      initImmediate: false, // Wait for loading to be completed before return to the function
      backend: {
        loadPath: `${__dirname}/assets/locales/{{lng}}/{{ns}}.json`,
      },
      preload: ["en", "fr"],
      fallbackLng: "en",
    });

    app.use(
      KoaI18next(i18next, {
        lookupQuerystring: "locale", // detect language in query
        lookupCookie: "locale", // detect language in cookie
        order: ["querystring", "cookie"],
        next: true,
      }),
    );
  };
}
