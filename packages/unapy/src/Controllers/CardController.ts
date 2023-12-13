import CardService from "@/Services/CardService";
import { Request } from "express";
import { AbstractController } from "./Abstract";

class CardController extends AbstractController {
    validateRequest(req: Request) {
        // No validation needed
    }

    async processRequest(req: Request) {
        const cards = await CardService.getCardStack();
        const cardList = cards.map((card) => ({ src: card.src }));
        return {
            result: { cards: cardList },
            statusCode: 200,
        };
    }
}

export default new CardController();
