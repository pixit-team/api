import JwtService from "./JwtService";
import PasswordService from "./PasswordService";

export default class Services {
  public readonly jwtService: JwtService;

  public readonly passwordService: PasswordService;

  constructor(jwtService: JwtService, passwordService: PasswordService) {
    this.jwtService = jwtService;
    this.passwordService = passwordService;
  }
}
