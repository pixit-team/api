import RoomRepository from "./RoomRepository";
import UserRepository from "./UserRepository";

export default interface Repositories {
  readonly roomRepository: RoomRepository;
  readonly userRepository: UserRepository;
}
