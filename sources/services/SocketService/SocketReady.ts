import SocketIo from "socket.io";

import JwtService from "../JwtService";
import Repositories from "../../models/repositories";

import SocketImplementation from "./SocketImplementation";

class SocketReady implements SocketImplementation {
  private readonly io: SocketIo.Server;

  private readonly jwtService: JwtService;

  private readonly repositories: Repositories;

  constructor(
    io: SocketIo.Server,
    jwtService: JwtService,
    repositories: Repositories,
  ) {
    this.io = io;
    this.jwtService = jwtService;
    this.repositories = repositories;
  }

  public readonly sendMessage = async (message: string): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log(this.io !== undefined); // TODO: remove when actually using "io"
    // eslint-disable-next-line no-console
    console.log(this.jwtService !== undefined, this.repositories !== undefined);
    // eslint-disable-next-line no-console
    console.log(message); // TODO: Send message through socket
  };
}

export default SocketReady;
