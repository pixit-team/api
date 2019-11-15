import UserView from "./UserView";
import AlbumView from "./AlbumView";

export default interface Views {
  readonly userView: UserView;
  readonly albumView: AlbumView;
}
