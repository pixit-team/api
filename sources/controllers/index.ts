import ApiEndpointController from "./ApiEndpointController";
import AuthLocalController from "./AuthLocalController";
import RoomController from "./RoomController";
import UserController from "./UserController";

export default interface Controllers {
  readonly apiEndpointController: ApiEndpointController;
  readonly authLocalController: AuthLocalController;
  readonly userController: UserController;
  readonly roomController: RoomController;
}
