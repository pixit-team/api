import Controllers from "../controllers";
import Middlewares from "../middlewares";

import BaseRouter from "./BaseRouter";

export default class UserRouter extends BaseRouter {
  constructor(controllers: Controllers, middlewares: Middlewares) {
    super("/users");

    this.router.get(
      "/me",
      middlewares.authenticatedOnly,
      controllers.userController.personalInfo,
    );
  }
}
