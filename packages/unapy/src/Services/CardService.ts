import ArrayUtil from "@/Utils/ArrayUtil";

import { CardColors, CardData, CardTypes } from "@uno-game/protocols";

import { CardFactoryWithProxy as CardFactory } from "@/Factories/CardFactory";


class CardServiceIterator {
    private index: number = 0;

    constructor(private cards: CardData[]) {}

    hasNext(): boolean {
        return this.index < this.cards.length;
    }

    next(): CardData | null {
        return this.hasNext() ? this.cards[this.index++] : null;
    }
}

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

    private readonly cardSuperTypes: CardTypes[] = [
        "block",
        "buy-2",
        "reverse",
    ];

    private readonly cardSuperColors: CardColors[] = [
        "blue",
        "green"
    ];

    async setupRandomCards(): Promise<CardData[]> {
        const randomCards: CardData[] = [
            ...(await this.getCardStack()),
            ...(await this.getCardStack()),
        ];

        ArrayUtil.shuffle(randomCards);

        return randomCards;
    }

    async setupRandomSuperCards(): Promise<CardData[]> {
        const randomCards: CardData[] = [
            ...(await this.getSuperCardStack()),
            ...(await this.getSuperCardStack()),
            ...(await this.getSuperCardStack()),
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

    async getSuperCardStack(): Promise<CardData[]> {
        const cardStack: CardData[] = [];

        const cardFactory = new CardFactory();

        this.cardSuperTypes.map((cardSuperType) => {
            this.cardSuperColors.map((cardSuperColor) => {
                cardStack.push(
                    cardFactory.createNormalCard(cardSuperType, cardSuperColor)
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

    async *cardIterator(cardStack: CardData[]): AsyncGenerator<CardData> {
        const iterator = new CardServiceIterator(cardStack);
        while (iterator.hasNext()) {
            yield iterator.next()!;
        }
    }

    async *setupRandomCardsIterator(): AsyncGenerator<CardData> {
        const randomCards = await this.setupRandomCards();
        yield* this.cardIterator(randomCards);
    }

    async *setupRandomSuperCardsIterator(): AsyncGenerator<CardData> {
        const randomSuperCards = await this.setupRandomSuperCards();
        yield* this.cardIterator(randomSuperCards);
    }
}

export default new CardService();
