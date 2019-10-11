import { createConnection, Connection } from "mongoose";

// Controllers
import Controllers from "./controllers";
import ApiEndpointController from "./controllers/ApiEndpointController";
// Repositories
import Repositories from "./models/repositories";
import UserRepository from "./models/repositories/UserRepository";
// Routers
import BaseRouter from "./routers/BaseRouter";
import ApiEndpointRouter from "./routers/ApiEndpointRouter";
// Utils
import envOrThrow from "./utils/envOrThrow";
// modules
import Server from "./server";

const DEFAULT_PORT = "5000";

const createServer = (conn: Connection): Server => {
  // Create Repositories
  const repositories = new Repositories(new UserRepository(conn));

  if (!repositories) throw new Error("Bruh"); // TODO REMOVE, this if is because of the "unused" warning

  // Create Controllers
  const controllers = new Controllers(new ApiEndpointController());

  // Create Routers
  const routers: BaseRouter[] = [new ApiEndpointRouter(controllers)];

  // Create Server
  return new Server(routers);
};

const main = (): void => {
  const DB_URL = envOrThrow("DATABASE_URL");

  const PORT = parseInt(process.env.PORT || DEFAULT_PORT, 10);
  if (Number.isNaN(PORT)) {
    throw new Error('Missing environment variable "PORT"');
  }

  // Connect to the Database and start the Server
  createConnection(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(conn => {
    console.info("[INFO] Connected to database");

    const server = createServer(conn);
    server.listen(PORT, () => {
      console.info(`[INFO] Server started on port ${PORT}`);
    });
  });
};

if (require.main === module) {
  main();
}
