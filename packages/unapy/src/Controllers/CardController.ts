import CardService from "@/Services/CardService";
import { Request, Response } from "express";

class CardController {
    async getCardList(req: Request, res: Response) {
        try {
            console.log("Request received for getCardList");

            const cardIterator = CardService.setupRandomCardsIterator();
            const cardList: { src: string }[] = [];

            for await (const card of cardIterator) {
                cardList.push({ src: card.src });
            }

            console.log("Sending response for getCardList");
            return res.status(200).json({
                cards: cardList,
            });
        } catch (error) {
            console.error("Error retrieving card list:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default new CardController();
