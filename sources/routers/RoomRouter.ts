import Controllers from "../controllers";
import Middlewares from "../middlewares";

import BaseRouter from "./BaseRouter";

export default class RoomRouter extends BaseRouter {
  constructor(controllers: Controllers, middlewares: Middlewares) {
    super("/rooms");

    this.router.get("/", controllers.roomController.getRooms); // Keep it for debug  // TODO Remove

    this.router.post(
      "/",
      middlewares.authenticatedOnly,
      controllers.roomController.createRoom,
    );

    this.router.post(
      "/:roomUuid/join",
      middlewares.authenticatedOnly,
      middlewares.roomExists,
      controllers.roomController.joinRoom,
    );

    this.router.post(
      "/:roomUuid/music-add",
      middlewares.authenticatedOnly,
      middlewares.roomExists,
      middlewares.userInRoom,
      controllers.roomController.musicAdd,
    );

    this.router.post(
      "/:roomUuid/music-play",
      middlewares.authenticatedOnly,
      middlewares.roomExists,
      middlewares.userInRoom,
      controllers.roomController.musicPlay,
    );

    this.router.post(
      "/:roomUuid/music-pause",
      middlewares.authenticatedOnly,
      middlewares.roomExists,
      middlewares.userInRoom,
      controllers.roomController.musicPause,
    );

    this.router.post(
      "/:roomUuid/music-next",
      middlewares.authenticatedOnly,
      middlewares.roomExists,
      middlewares.userInRoom,
      controllers.roomController.musicNext,
    );
  }
}
