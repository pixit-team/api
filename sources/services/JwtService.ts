import Jwt from "jsonwebtoken";

export default class JwtService {
  private readonly privateKey: string;

  constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  public tokenize<TData>(data: TData): string {
    return Jwt.sign({ data }, this.privateKey);
  }

  public decode<TData>(token: string): TData | undefined {
    try {
      const { data } = Jwt.verify(token, this.privateKey) as { data: TData };
      return data;
    } catch (e) {
      return undefined;
    }
  }
}
