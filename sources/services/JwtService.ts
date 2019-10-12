import Jwt from "jsonwebtoken";

export default class JwtService {
  private readonly privateKey: string;

  constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  public readonly tokenize = (data: object): string => {
    return Jwt.sign({ data }, this.privateKey);
  };

  public readonly decode = (token: string): object | undefined => {
    try {
      const { data } = Jwt.verify(token, this.privateKey) as { data: object };
      return data;
    } catch (e) {
      return undefined;
    }
  };
}
