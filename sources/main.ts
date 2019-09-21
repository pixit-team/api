import { createConnection, Connection } from "typeorm";

// Controllers
import Controllers from "./controllers";
import ApiEndpointController from "./controllers/ApiEndpointController";
// Repositories
import Repositories from "./models/repositories";
import UserRepository from "./models/repositories/UserRepository";
// Routers
import BaseRouter from "./routers/BaseRouter";
import ApiEndpointRouter from "./routers/ApiEndpointRouter";
// modules
import loadDbConfig from "./loadDbConfig";
import Server from "./Server";

const createServer = (conn: Connection): Server => {
  // Create Repositories
  const repositories = new Repositories(new UserRepository(conn));

  if (!repositories) throw new Error("Bruh"); // TODO REMOVE

  // Create Controllers
  const controllers = new Controllers(new ApiEndpointController());

  // Create Routers
  const routers: BaseRouter[] = [new ApiEndpointRouter(controllers)];

  // Create Server
  return new Server(routers);
};

const main = (): void => {
  const dbConfig = loadDbConfig("../ormconfig.js");

  // Retrieve configuration
  const PORT = parseInt(process.env.PORT || "", 10);
  if (Number.isNaN(PORT)) {
    throw new Error('Missing environment variable "PORT"');
  }

  createConnection(dbConfig).then(conn => {
    console.info("[INFO] Connected to database");

    // Create Server
    const server = createServer(conn);
    server.listen(PORT, () => {
      console.info(`[INFO] Server started on port ${PORT}`);
    });
  });
};

if (require.main === module) {
  main();
}
