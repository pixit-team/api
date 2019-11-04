import JwtService from "./JwtService";
import PasswordService from "./PasswordService";
import SocketService from "./SocketService";

export default class Services {
  public readonly jwtService: JwtService;

  public readonly passwordService: PasswordService;

  public readonly socketService: SocketService;

  constructor(
    jwtService: JwtService,
    passwordService: PasswordService,
    socketService: SocketService,
  ) {
    this.jwtService = jwtService;
    this.passwordService = passwordService;
    this.socketService = socketService;
  }
}
