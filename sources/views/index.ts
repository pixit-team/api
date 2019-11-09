import UserView from "./UserView";
import RoomView from "./RoomView";

export default interface Views {
  readonly userView: UserView;
  readonly roomView: RoomView;
}
