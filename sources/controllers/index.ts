import ApiEndpointController from "./ApiEndpointController";
import AuthLocalController from "./AuthLocalController";
import UserController from "./UserController";

export default class Controllers {
  public readonly apiEndpointController: ApiEndpointController;

  public readonly authLocalController: AuthLocalController;

  public readonly userController: UserController;

  constructor(
    apiEndpointController: ApiEndpointController,
    authLocalController: AuthLocalController,
    userController: UserController,
  ) {
    this.apiEndpointController = apiEndpointController;
    this.authLocalController = authLocalController;
    this.userController = userController;
  }
}
