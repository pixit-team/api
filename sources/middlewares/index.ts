import { ApiContext } from "../utils/ApiContext";

type Middleware = (ctx: ApiContext, next: () => Promise<void>) => Promise<void>;

export default class Middlewares {
  public readonly authenticatedOnly: Middleware;

  constructor(authenticatedOnly: Middleware) {
    this.authenticatedOnly = authenticatedOnly;
  }
}
