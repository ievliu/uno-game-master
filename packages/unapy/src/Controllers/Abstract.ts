import { Request, Response } from "express";

export type AbstractResponse = {
    result: any;
    statusCode: number;
    errorMessage?: string;
};

export abstract class AbstractController {
    async handleRequest(req: Request, res: Response): Promise<Response> {
        try {
            this.validateRequest(req);
            const { result, statusCode, errorMessage } =
                await this.processRequest(req);

            if (errorMessage) {
                return res.status(statusCode).send(errorMessage);
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }

    abstract validateRequest(req: Request): void;
    abstract processRequest(req: Request): Promise<AbstractResponse>;
}
