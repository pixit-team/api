import Controllers from "../controllers";
import Middlewares from "../middlewares";

import BaseRouter from "./BaseRouter";

export default class RoomRouter extends BaseRouter {
  constructor(controllers: Controllers, middlewares: Middlewares) {
    super("/rooms");

    this.router.get("/", controllers.roomController.getRooms); // Keep it for debug  // TODO Remove

    this.router.get(
      "/:uuid",
      middlewares.authenticatedOnly,
      controllers.roomController.getRoom,
    );
    this.router.post(
      "/",
      middlewares.authenticatedOnly,
      controllers.roomController.createRoom,
    );
    this.router.post(
      "/:uuid/join",
      middlewares.authenticatedOnly,
      controllers.roomController.joinRoom,
    );
    this.router.post(
      "/:uuid/music-add",
      middlewares.authenticatedOnly,
      middlewares.roomExists,
      middlewares.userInRoom,
      controllers.roomController.musicAdd,
    );
  }
}
