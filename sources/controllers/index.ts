import ApiEndpointController from "./ApiEndpointController";
import AuthLocalController from "./AuthLocalController";
import RoomController from "./RoomController";
import UserController from "./UserController";

export default class Controllers {
  public readonly apiEndpointController: ApiEndpointController;

  public readonly authLocalController: AuthLocalController;

  public readonly userController: UserController;

  public readonly roomController: RoomController;

  constructor(
    apiEndpointController: ApiEndpointController,
    authLocalController: AuthLocalController,
    roomController: RoomController,
    userController: UserController,
  ) {
    this.apiEndpointController = apiEndpointController;
    this.authLocalController = authLocalController;
    this.userController = userController;
    this.roomController = roomController;
  }
}
