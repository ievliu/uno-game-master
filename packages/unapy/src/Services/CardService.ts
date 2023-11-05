import ArrayUtil from "@/Utils/ArrayUtil";

import { CardColors, CardData, CardTypes } from "@uno-game/protocols";

import { CardFactory } from "@/Factories/CardFactory";

class CardService {
    private readonly cardTypes: CardTypes[] = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "block",
        "buy-2",
        "reverse",
    ];

    private readonly cardColors: CardColors[] = [
        "blue",
        "green",
        "red",
        "yellow",
    ];

    async setupRandomCards(): Promise<CardData[]> {
        const randomCards: CardData[] = [
            ...(await this.getCardStack()),
            ...(await this.getCardStack()),
        ];

        ArrayUtil.shuffle(randomCards);

        return randomCards;
    }

    async retrieveRandomCardColor(): Promise<CardColors> {
        const cardColors: CardColors[] = ["blue", "green", "yellow", "red"];

        ArrayUtil.shuffle(cardColors);

        return cardColors[0];
    }

    async getCardStack(): Promise<CardData[]> {
        const cardStack: CardData[] = [];

        const cardFactory = new CardFactory();

        this.cardTypes.map((cardType) => {
            this.cardColors.map((cardColor) => {
                cardStack.push(
                    cardFactory.createNormalCard(cardType, cardColor)
                );
            });
        });

        for (let i = 0; i < 2; i++) {
            cardStack.push(cardFactory.createBuyFourCard());
        }

        for (let i = 0; i < 2; i++) {
            cardStack.push(cardFactory.createChangeColorCard());
        }

        return cardStack;
    }
}

export default new CardService();
