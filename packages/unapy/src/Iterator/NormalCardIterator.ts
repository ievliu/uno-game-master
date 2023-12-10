import { CardData } from "@uno-game/protocols";
import {Iterator} from "./Iterator";

export class NormalCardIterator implements Iterator<CardData> {
    private index: number = 0;

    constructor(private cards: CardData[]) {}

    hasNext(): boolean {
        return this.index < this.cards.length;
    }

    next(): CardData | null {
        return this.hasNext() ? this.cards[this.index++] : null;
    }
}