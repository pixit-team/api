import AlbumRepository from "./AlbumRepository";
import UserRepository from "./UserRepository";

export default interface Repositories {
  readonly albumRepository: AlbumRepository;
  readonly userRepository: UserRepository;
}
