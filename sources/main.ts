import { createConnection, Connection } from "mongoose";

// Controllers
import Controllers from "./controllers";
import ApiEndpointController from "./controllers/ApiEndpointController";
import AuthLocalController from "./controllers/AuthLocalController";
// Repositories
import Models from "./models/Models";
import Repositories from "./models/repositories";
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
// Routers
import BaseRouter from "./routers/BaseRouter";
import ApiEndpointRouter from "./routers/ApiEndpointRouter";
import AuthLocalRouter from "./routers/AuthLocalRouter";
//
import Views from "./views";
import UserView from "./views/UserView";
// Utils
import envOrThrow from "./utils/envOrThrow";
// modules
import Server from "./server";

const DEFAULT_PORT = "5000";

const createServer = (conn: Connection, config: Config): Server => {
  // Models
  const models = new Models(conn);

  // Create Repositories
  const repositories = new Repositories(new UserRepository(models));

  // Create Services
  const services = new Services(
    new JwtService(config.JWT_PRIVATE_KEY),
    new PasswordService(),
  );

  // Create Validators
  const emailValidator = new EmailValidator();
  const nameValidator = new NameValidator();
  const passwordValidator = new PasswordValidator();
  const validators = new Validators(
    emailValidator,
    nameValidator,
    passwordValidator,
  );

  // Create Views
  const views = new Views(new UserView());
  if (!views) throw new Error(""); // TODO: Remove, used because of warning

  // Create Controllers
  const controllers = new Controllers(
    new ApiEndpointController(),
    new AuthLocalController(repositories, services, validators),
  );

  // Create Routers
  const routers: BaseRouter[] = [
    new ApiEndpointRouter(controllers),
    new AuthLocalRouter(controllers),
  ];

  // Create Server
  return new Server(routers);
};

const main = (): void => {
  const DB_URL = envOrThrow("DATABASE_URL");

  const PORT = parseInt(process.env.PORT || DEFAULT_PORT, 10);
  if (Number.isNaN(PORT)) {
    throw new Error('Missing environment variable "PORT"');
  }

  const JWT_PRIVATE_KEY = envOrThrow("JWT_PRIVATE_KEY");

  // Connect to the Database and start the Server
  createConnection(DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(conn => {
    console.info("[INFO] Connected to database");

    console.info("[INFO] Server: loading...");
    const server = createServer(conn, { JWT_PRIVATE_KEY });
    server.listen(PORT, () => {
      console.info(`[INFO] Server: Started on port ${PORT}`);
    });
  });
};

type Config = {
  JWT_PRIVATE_KEY: string;
};

if (require.main === module) {
  main();
}
