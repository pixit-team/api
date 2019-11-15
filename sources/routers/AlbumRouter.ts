import Controllers from "../controllers";
import Middlewares from "../middlewares";

import BaseRouter from "./BaseRouter";

export default class AlbumRouter extends BaseRouter {
  constructor(controllers: Controllers, middlewares: Middlewares) {
    super("/albums");

    this.router.get(
      "/",
      middlewares.authenticatedOnly,
      controllers.albumController.getAlbums,
    );

    this.router.get(
      "/myAlbums",
      middlewares.authenticatedOnly,
      controllers.albumController.myAlbums,
    );

    this.router.get(
      "/:albumUuid",
      middlewares.authenticatedOnly,
      middlewares.albumExists,
      middlewares.userInAlbum,
      controllers.albumController.getAlbum,
    );

    this.router.post(
      "/",
      middlewares.authenticatedOnly,
      controllers.albumController.createAlbum,
    );

    this.router.post(
      "/:albumUuid/join",
      middlewares.authenticatedOnly,
      middlewares.albumExists,
      controllers.albumController.joinAlbum,
    );

    this.router.post(
      "/:albumUuid/leave",
      middlewares.authenticatedOnly,
      middlewares.albumExists,
      controllers.albumController.leaveAlbum,
    );

    this.router.post(
      "/:albumUuid/photo-add",
      middlewares.authenticatedOnly,
      middlewares.albumExists,
      middlewares.userInAlbum,
      controllers.albumController.photoAdd,
    );

    this.router.post(
      "/:albumUuid/photo-remove",
      middlewares.authenticatedOnly,
      middlewares.albumExists,
      middlewares.userInAlbum,
      controllers.albumController.photoRemove,
    );
  }
}
