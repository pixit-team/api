import { Router } from "express";

import { ApiEndpointController } from "./controllers/ApiEndpointController";

export const createRouter = (
    // Controllers
    apiEndpointController: ApiEndpointController,
): Router => {
    const router = Router();

    // Api Endpoint
    router.get("/", apiEndpointController.endpoint);

    return router;
}
