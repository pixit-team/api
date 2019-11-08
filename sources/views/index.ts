import UserView from "./UserView";
import RoomView from "./RoomView";

export default class Views {
  public readonly userView: UserView;

  public readonly roomView: RoomView;

  constructor(userView: UserView, roomView: RoomView) {
    this.userView = userView;
    this.roomView = roomView;
  }
}
