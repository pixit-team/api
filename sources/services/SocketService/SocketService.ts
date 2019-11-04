import Http from "http";

import SocketIo from "socket.io";

import JwtService from "../JwtService";
import Repositories from "../../models/repositories";

import SocketImplementation from "./SocketImplementation";
import SocketNotReady from "./SocketNotReady";
import SocketReady from "./SocketReady";

export default class SocketService {
  private socketHandler: SocketImplementation;

  constructor() {
    this.socketHandler = new SocketNotReady();
  }

  public readonly deferredInit = (
    httpServer: Http.Server,
    jwtService: JwtService,
    repositories: Repositories,
  ): void => {
    const io = SocketService.initIo(httpServer);
    this.socketHandler = new SocketReady(io, jwtService, repositories);
  };

  private static readonly initIo = (
    httpServer: Http.Server,
  ): SocketIo.Server => {
    const io = SocketIo(httpServer);

    io.on("connection", socket => {
      // TODO
      // eslint-disable-next-line no-console
      console.log("Connected, socket is defined as ", socket);
    });

    return io;
  };

  public readonly sendMessage = async (message: string): Promise<void> => {
    this.socketHandler.sendMessage(message);
  };
}
