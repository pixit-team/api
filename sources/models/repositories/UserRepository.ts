import { Connection } from "typeorm";

import User from "../entities/User";

export default class UserRepository {
  private readonly conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
  }

  /**
   * Find a specific User by its id
   *
   * @param   userId
   */
  public readonly getUserById = (userId: number): Promise<User | undefined> => {
    return this.conn.getRepository(User).findOne(userId);
  };
}
