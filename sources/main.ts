import Server from "./Server";
import ApiEndpointController from "./controllers/ApiEndpointController";
import Controllers from "./controllers";
import BaseRouter from "./routers/BaseRouter";
import ApiEndpointRouter from "./routers/ApiEndpointRouter";

const main = (): void => {
    // Retrieve configuration
    const PORT = parseInt(process.env.PORT || '', 10);
    if (isNaN(PORT)) {
        throw new Error('Missing environment variable "PORT"');
    }

    // Create and start Server
    const server = createServer();
    server.listen(PORT, () => {
        console.info(`Server started on port ${PORT}`);
    });
}

const createServer = (): Server => {
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
