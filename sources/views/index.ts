import UserView from "./UserView";

export default class Views {
  public readonly userView: UserView;

  constructor(userView: UserView) {
    this.userView = userView;
  }
}
