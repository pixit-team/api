import { Connection } from "mongoose";

export default class UserRepository {
  private readonly conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
  }

  // TODO: Get user by id

  // TODO: REMOVE
  public readonly todoREMOVE = (): void => {
    if (!this.conn) {
      throw new Error("Bruuh");
    }
  };
}
