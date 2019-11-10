import SocketIo from "socket.io";

import { isRoomMember } from "./core/types/Room";
import TokenPayload from "./core/types/TokenPayload";
import Repositories from "./models/repositories";
import { UserDocument } from "./models/schemas/UserSchema";
import Services from "./services";

interface AuthenticatePayload {
  token: string;
  roomUuid: string;
}

type SocketContext = {
  repositories: Repositories;
  services: Services;
  socket: SocketIo.Socket;
  io: SocketIo.Server;
};

//
// All event handlers (once the authentication is validated)
//
const addSocketListeners = (
  context: SocketContext,
  user: UserDocument,
  roomUuid: string,
): void => {
  context.socket.on("disconnect", async () => {
    // Retrieve latest Room information
    const room = await context.repositories.roomRepository.findOneByUuid(
      roomUuid,
    );
    if (!room) {
      return; // Should not happen
    }

    // Update status in room
    await context.repositories.roomRepository.setMemberStatus(
      room,
      user._id,
      false,
    );

    // Broadcast to everyone in the Room
    context.io.to(roomUuid).emit("user_leave", user._id);
  });
};

//
// Perform authentication
//
const onAuth = (context: SocketContext) => async (
  payload: AuthenticatePayload,
): Promise<void> => {
  const { token, roomUuid } = payload;

  // Validate token
  const decodedToken = context.services.jwtService.decode<TokenPayload>(token);
  if (!decodedToken) {
    context.socket.emit("exception", "Invalid token");
    return;
  }

  // Retrieve User's information
  const user = await context.repositories.userRepository.findOneById(
    decodedToken.id,
  );
  if (!user) {
    // Should normally not happen
    context.socket.emit("exception", "Could not retrieve User information");
    return;
  }

  // Make sure the Room exists
  const room = await context.repositories.roomRepository.findOneByUuid(
    roomUuid,
  );
  if (!room) {
    context.socket.emit("exception", "Room not found");
    return;
  }

  // Make sure the User is a member of the Room
  if (!isRoomMember(room, user._id)) {
    context.socket.emit("exception", "You cannot access this Room");
    return;
  }

  // The authentication is a success
  // Register socket with Room and add listeners
  context.socket.join(room.uuid);
  addSocketListeners(context, user, roomUuid);

  // Make User status "active" and broadcast the information
  await context.repositories.roomRepository.setMemberStatus(
    room,
    user._id,
    true,
  );
  context.io.to(roomUuid).emit("user_join", {
    id: user._id,
    name: user.name,
    isConnected: true,
  });
};

export default (repositories: Repositories, services: Services) => (
  io: SocketIo.Server,
): void => {
  io.on("connect", socket => {
    socket.on("authenticate", onAuth({ repositories, services, socket, io }));
  });
};
