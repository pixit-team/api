import Controllers from "../controllers";

import BaseRouter from "./BaseRouter";

export default class ApiEndpointRouter extends BaseRouter {
  constructor(controllers: Controllers) {
    super("/");

    this.router.get("/", controllers.apiEndpointController.endpoint);
  }
}
