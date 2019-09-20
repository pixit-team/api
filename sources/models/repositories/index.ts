import UserRepository from "./UserRepository";

export default class Repositories {

    public readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
}
