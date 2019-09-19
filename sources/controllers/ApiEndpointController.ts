import { Request, Response } from "express";

export class ApiEndpointController {
    public readonly endpoint = (_req: Request, res: Response) => {
        res.status(200).json({
            message: "melosync API !",
        });
    }
}
