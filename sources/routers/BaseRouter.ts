import KoaRouter from "koa-router";

export default abstract class BaseRouter {
  protected readonly router: KoaRouter;

  constructor(prefix: string) {
    this.router = new KoaRouter({ prefix });
    console.info(`[INFO] Server: Routes: "${prefix}" registered`);
  }

  public readonly routes = (): KoaRouter.IMiddleware => {
    return this.router.routes();
  };
}
