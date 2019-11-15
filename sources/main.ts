import { createConnection, Connection } from "mongoose";

// Controllers
import Controllers from "./controllers";
import ApiEndpointController from "./controllers/ApiEndpointController";
import AuthLocalController from "./controllers/AuthLocalController";
import AlbumController from "./controllers/AlbumController";
import UserController from "./controllers/UserController";
// Repositories
import Models from "./models/Models";
import Repositories from "./models/repositories";
import AlbumRepository from "./models/repositories/AlbumRepository";
import UserRepository from "./models/repositories/UserRepository";
// Services
import Services from "./services";
import JwtService from "./services/JwtService";
import PasswordService from "./services/PasswordService";
// Validators
import Validators from "./validators";
import EmailValidator from "./validators/EmailValidator";
import NameValidator from "./validators/NameValidator";
import PasswordValidator from "./validators/PasswordValidator";
// Middlewares
import Middlewares from "./middlewares";
import AuthenticatedOnlyMiddleware from "./middlewares/authenticatedOnlyMiddleware";
import AlbumExistsMiddleware from "./middlewares/albumExistsMiddleware";
import UserInAlbumMiddleware from "./middlewares/userInAlbumMiddleware";
// Routers
import BaseRouter from "./routers/BaseRouter";
import ApiEndpointRouter from "./routers/ApiEndpointRouter";
import AuthLocalRouter from "./routers/AuthLocalRouter";
import AlbumRouter from "./routers/AlbumRouter";
import UserRouter from "./routers/UserRouter";
// Views
import Views from "./views";
import UserView from "./views/UserView";
import AlbumView from "./views/AlbumView";
// modules
import loadConfig, { Config } from "./config";
import Server from "./server";

const createServer = (conn: Connection, config: Config): Server => {
  // Models
  const models = new Models(conn);

  // Create Repositories
  const repositories: Repositories = {
    albumRepository: new AlbumRepository(models),
    userRepository: new UserRepository(models),
  };

  // Create Services
  const jwtService = new JwtService(config.JWT_PRIVATE_KEY);
  const services = new Services(jwtService, new PasswordService());

  // Create Validators
  const validators = new Validators(
    new EmailValidator(),
    new NameValidator(),
    new PasswordValidator(),
  );

  // Create Views
  const views: Views = {
    userView: new UserView(),
    albumView: new AlbumView(),
  };

  // Create Middlewares
  const middlewares: Middlewares = {
    authenticatedOnly: AuthenticatedOnlyMiddleware(repositories, services),
    albumExists: AlbumExistsMiddleware(repositories),
    userInAlbum: UserInAlbumMiddleware(),
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
    albumController: new AlbumController(repositories, views),
    userController: new UserController(views),
  };

  // Create Routers
  const routers: BaseRouter[] = [
    new ApiEndpointRouter(controllers),
    new AuthLocalRouter(controllers),
    new AlbumRouter(controllers, middlewares),
    new UserRouter(controllers, middlewares),
  ];

  // Create Server
  const server = new Server(routers);
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
