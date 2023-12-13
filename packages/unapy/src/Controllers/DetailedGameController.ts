import GameService from "@/Services/GameService";
import { Request } from "express";
import { AbstractController } from "./Abstract";

class DetailedGameController extends AbstractController {
    validateRequest(req: Request) {
        // No validation needed
    }

    async processRequest(req: Request) {
        const { gameId } = req.params;

        if (!gameId) {
            return {
                result: null,
                statusCode: 400,
                errorMessage: "Bad Request: gameId was not supplied",
            };
        }

        const game = await GameService.getGame(gameId);

        if (!game) {
            return {
                result: null,
                statusCode: 404,
                errorMessage: "Not found: no game found for this gameId",
            };
        }

        return {
            result: game,
            statusCode: 200,
        };
    }
}

export default new DetailedGameController();
