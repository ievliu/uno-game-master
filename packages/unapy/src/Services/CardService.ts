import ArrayUtil from "@/Utils/ArrayUtil";

import { CardColors, CardData, CardTypes } from "@uno-game/protocols";

import { CardFactoryWithProxy as CardFactory } from "@/Factories/CardFactory";

import { Iterator } from "@/Iterator/Iterator";
import { CustomCardIterator } from "@/Iterator/CustomCardIterator";
import { NormalCardIterator } from "@/Iterator/NormalCardIterator";
import { SuperCardIterator } from "@/Iterator/SuperCardIterator";


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

    private readonly CustomcardTypes: CardTypes[] = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
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

    async setupCustomCards(): Promise<CardData[]> {
        const randomCards: CardData[] = [
            ...(await this.getCustomStack()),
            ...(await this.getCustomStack()),
            ...(await this.getCustomStack()),
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

    async getCustomStack(): Promise<CardData[]> {
        const cardStack: CardData[] = [];

        const cardFactory = new CardFactory();

        this.CustomcardTypes.map((CustomcardTypes) => {
            this.cardColors.map((cardColors) => {
                cardStack.push(
                    cardFactory.createNormalCard(CustomcardTypes, cardColors)
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

    async *cardIterator(cardStack: CardData[], iterator: Iterator<CardData>): AsyncGenerator<CardData> {
        const cardServiceIterator = iterator;
        while (cardServiceIterator.hasNext()) {
            yield cardServiceIterator.next()!;
        }
    }

    async *setupRandomCardsIterator(): AsyncGenerator<CardData> {
        const randomCards = await this.setupRandomCards();
        const normalCardIterator = new NormalCardIterator(randomCards);
        yield* this.cardIterator(randomCards, normalCardIterator);
    }

    async *setupRandomSuperCardsIterator(): AsyncGenerator<CardData> {
        const randomSuperCards = await this.setupRandomSuperCards();
        const superCardIterator = new SuperCardIterator(randomSuperCards);
        yield* this.cardIterator(randomSuperCards, superCardIterator);
    }

    async *setupCustomCardsIterator(): AsyncGenerator<CardData> {
        const customCards = await this.setupCustomCards();
        const customCardIterator = new CustomCardIterator(customCards);
        yield* this.cardIterator(customCards, customCardIterator);
    }
}

export default new CardService();
