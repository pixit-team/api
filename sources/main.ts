import { createConnection, Connection } from "typeorm";
import Server from "./Server";
import * as DbConfig from "./dbConfig";
import ApiEndpointController from "./controllers/ApiEndpointController";
import Controllers from "./controllers";
import BaseRouter from "./routers/BaseRouter";
import ApiEndpointRouter from "./routers/ApiEndpointRouter";
import Repositories from "./models/repositories";
import UserRepository from "./models/repositories/UserRepository";

const main = (): void => {
    const dbConfig = DbConfig.load("../ormconfig.js");

    // Retrieve configuration
    const PORT = parseInt(process.env.PORT || '', 10);
    if (isNaN(PORT)) {
        throw new Error('Missing environment variable "PORT"');
    }

    createConnection(dbConfig)
    .then(conn => {
            console.info("[INFO] Connected to database");

            // Create Server
            const server = createServer(conn);
            server.listen(PORT, () => {
                console.info(`[INFO] Server started on port ${PORT}`);
            });
        });
}

const createServer = (conn: Connection): Server => {
    // Create Repositories
    const repositories = new Repositories(
        new UserRepository(conn),
    )

    if (!repositories) throw new Error("Bruh"); // TODO REMOVE

    // Create Controllers
    const controllers = new Controllers(
        new ApiEndpointController(),
    );

    // Create Routers
    const routers: BaseRouter[] = [
        new ApiEndpointRouter(controllers),
    ];

    // Create Server
    return new Server(routers);
}

if (require.main === module) {
    main();
}
