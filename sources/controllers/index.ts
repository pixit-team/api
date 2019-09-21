import ApiEndpointController from "./ApiEndpointController";

export default class Controllers {
  public readonly apiEndpointController: ApiEndpointController;

  constructor(apiEndpointController: ApiEndpointController) {
    this.apiEndpointController = apiEndpointController;
  }
}
