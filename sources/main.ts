import { createConnection, Connection } from "mongoose";

// Controllers
import Controllers from "./controllers";
import ApiEndpointController from "./controllers/ApiEndpointController";
import AuthLocalController from "./controllers/AuthLocalController";
import RoomController from "./controllers/RoomController";
import UserController from "./controllers/UserController";
// Repositories
import Models from "./models/Models";
import Repositories from "./models/repositories";
import RoomRepository from "./models/repositories/RoomRepository";
import UserRepository from "./models/repositories/UserRepository";
// Services
import Services from "./services";
import JwtService from "./services/JwtService";
import PasswordService from "./services/PasswordService";
import SocketService from "./services/SocketService";
// Validators
import Validators from "./validators";
import EmailValidator from "./validators/EmailValidator";
import NameValidator from "./validators/NameValidator";
import PasswordValidator from "./validators/PasswordValidator";
// Middlewares
import Middlewares from "./middlewares";
import AuthenticatedOnlyMiddleware from "./middlewares/authenticatedOnlyMiddleware";
import RoomExistsMiddleware from "./middlewares/roomExistsMiddleware";
import UserInRoomMiddleware from "./middlewares/userInRoomMiddleware";
// Routers
import BaseRouter from "./routers/BaseRouter";
import ApiEndpointRouter from "./routers/ApiEndpointRouter";
import AuthLocalRouter from "./routers/AuthLocalRouter";
import RoomRouter from "./routers/RoomRouter";
import UserRouter from "./routers/UserRouter";
// Views
import Views from "./views";
import UserView from "./views/UserView";
import RoomView from "./views/RoomView";
// modules
import loadConfig, { Config } from "./config";
import Server from "./server";
import socketHandler from "./socketHandler";

const createServer = (conn: Connection, config: Config): Server => {
  // Models
  const models = new Models(conn);

  // Create Repositories
  const repositories: Repositories = {
    roomRepository: new RoomRepository(models),
    userRepository: new UserRepository(models),
  };

  // Create Services
  const jwtService = new JwtService(config.JWT_PRIVATE_KEY);
  const socketService = new SocketService();
  const services = new Services(
    jwtService,
    new PasswordService(),
    socketService,
  );

  // Create Validators
  const validators = new Validators(
    new EmailValidator(),
    new NameValidator(),
    new PasswordValidator(),
  );

  // Create Views
  const views: Views = {
    userView: new UserView(),
    roomView: new RoomView(),
  };

  // Create Middlewares
  const middlewares: Middlewares = {
    authenticatedOnly: AuthenticatedOnlyMiddleware(repositories, services),
    roomExists: RoomExistsMiddleware(repositories),
    userInRoom: UserInRoomMiddleware(),
  };

  // Create Controllers
  const controllers: Controllers = {
    apiEndpointController: new ApiEndpointController(),
    authLocalController: new AuthLocalController(
      repositories,
      services,
      validators,
      views,
    ),
    roomController: new RoomController(repositories, services, views),
    userController: new UserController(views),
  };

  // Create Routers
  const routers: BaseRouter[] = [
    new ApiEndpointRouter(controllers),
    new AuthLocalRouter(controllers),
    new RoomRouter(controllers, middlewares),
    new UserRouter(controllers, middlewares),
  ];

  // Create Server
  const server = new Server(routers);

  // SocketService's deferred initialization
  socketService.deferredInit(
    server.getServer(),
    socketHandler(repositories, services),
  );

  return server;
};

const main = (): void => {
  const CONFIG = loadConfig();

  // Connect to the Database and start the Server
  createConnection(CONFIG.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(conn => {
    console.info("[INFO] Connected to database");

    console.info("[INFO] Server: loading...");
    const server = createServer(conn, CONFIG);
    server.listen(CONFIG.PORT, () => {
      console.info(`[INFO] Server: Started on port ${CONFIG.PORT}`);
    });
  });
};

if (require.main === module) {
  main();
}
