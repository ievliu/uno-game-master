import CardService from "@/Services/CardService";
import { Request, Response } from "express";

abstract class AbstractController {
    async handleRequest(req: Request, res: Response) {
        try {
            this.validateRequest(req);
            const result = await this.processRequest(req);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }

    abstract validateRequest(req: Request): void;
    abstract processRequest(req: Request): Promise<any>;
}

class CardController extends AbstractController {
    validateRequest(req: Request) {
        // No validation needed for getting the card list
    }

    async processRequest(req: Request) {
        const cards = await CardService.getCardStack();
        const cardList = cards.map((card) => ({ src: card.src }));
        return { cards: cardList };
    }
}

export default new CardController();
