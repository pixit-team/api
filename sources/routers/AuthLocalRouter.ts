import Controllers from "../controllers";

import BaseRouter from "./BaseRouter";

export default class AuthLocalRouter extends BaseRouter {
  constructor(controllers: Controllers) {
    super("/auth/local");

    this.router.post("/register", controllers.authLocalController.register);
  }
}
