import { Server } from "./Server";
import { createRouter } from "./router";

import { ApiEndpointController } from "./controllers/ApiEndpointController";

const main = () => {
    const PORT = parseInt(process.env.PORT || '', 10);
    if (isNaN(PORT)) {
        throw new Error('Missing environment variable "PORT"');
    }

    // Server
    const server = createServer();
    server.start(PORT, () => {
        console.info(`Server started on port ${PORT}`);
    })
};

const createServer = () => {
    // Controllers
    const apiEndpointController = new ApiEndpointController();

    // Create Server
    const router = createRouter(apiEndpointController);
    return new Server(router);
};

if (require.main === module) {
    main();
}
