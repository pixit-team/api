import TokenPayload from "./core/types/TokenPayload";
import Services from "./services";
import Repositories from "./models/repositories";

interface AuthenticatePayload {
  token: string;
  roomUuid: string;
}

export default (repositories: Repositories, services: Services) => (
  io: SocketIO.Server,
): void => {
  io.on("connect", socket => {
    socket.on("authenticate", (payload: AuthenticatePayload) => {
      // Validate token
      const decodedToken = services.jwtService.decode<TokenPayload>(
        payload.token,
      );
      if (!decodedToken) {
        socket.emit("exception", "Invalid token");
        return;
      }

      // Make sure the Room exists
      repositories.roomRepository.findOneByUuid(payload.roomUuid).then(room => {
        if (!room) {
          socket.emit("exception", "Room not found");
          return;
        }

        // Make sure the User is a member of the Room
        if (!room.members.find(m => m.id.equals(decodedToken.id))) {
          socket.emit("exception", "You cannot access this Room");
          return;
        }

        // The authentication is a success
        // Register socket with Room and add listeners
        socket.join(room.uuid);
        console.info(`Connected to room: ${room.uuid}, ${decodedToken.id}`);

        // TODO: update status in room and broadcast "user_join"

        socket.on("disconnect", () => {
          console.info(`User ${decodedToken.id} disconnected`);
          // TODO: Update status in room and broadcast "user_leave"
        });
      });
    });
  });
};
