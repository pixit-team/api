import ApiEndpointController from "./ApiEndpointController";
import AuthLocalController from "./AuthLocalController";

export default class Controllers {
  public readonly apiEndpointController: ApiEndpointController;

  public readonly authLocalController: AuthLocalController;

  constructor(
    apiEndpointController: ApiEndpointController,
    authLocalController: AuthLocalController,
  ) {
    this.apiEndpointController = apiEndpointController;
    this.authLocalController = authLocalController;
  }
}
