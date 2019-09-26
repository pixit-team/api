import Koa from "koa";
import KoaLogger from "koa-logger";

export default (app: Koa): void => {
  app.use(KoaLogger());
};
