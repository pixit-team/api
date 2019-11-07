import RoomRepository from "./RoomRepository";
import UserRepository from "./UserRepository";

export default class Repositories {
  public readonly roomRepository: RoomRepository;

  public readonly userRepository: UserRepository;

  constructor(roomRepository: RoomRepository, userRepository: UserRepository) {
    this.roomRepository = roomRepository;
    this.userRepository = userRepository;
  }
}
