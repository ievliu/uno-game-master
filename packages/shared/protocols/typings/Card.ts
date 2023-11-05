export type CardColors = "yellow" | "blue" | "green" | "red" | "black";

export type CardTypes =
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "block"
    | "change-color"
    | "buy-2"
    | "buy-4"
    | "reverse";

type ColorMap = {
    [key in CardColors]?: string;
};

export type CardData = {
    id: string;
    src: string;
    name: string;
    color: CardColors;
    type: CardTypes;
    canBeUsed?: boolean;
    /**
     * If the card can be mixed with other cards of same type
     */
    canBeCombed?: boolean;
    selectedColor?: CardColors;
    possibleColors?: ColorMap;
};

export type CurrentCardCombo = {
    cardTypes: Array<CardTypes>;
    amountToBuy: number;
};

export class CardDataBuilder {
    private cardData: CardData = {
        id: "",
        src: "",
        name: "",
        color: "red",
        type: "0",
    };

    public setId(id: string): CardDataBuilder {
        this.cardData.id = id;

        return this;
    }

    public setSrc(src: string): CardDataBuilder {
        this.cardData.src = src;

        return this;
    }

    public setName(name: string): CardDataBuilder {
        this.cardData.name = name;

        return this;
    }

    public setColor(color: CardColors): CardDataBuilder {
        this.cardData.color = color;

        return this;
    }

    public setType(type: CardTypes): CardDataBuilder {
        this.cardData.type = type;

        return this;
    }

    public setCanBeUsed(canBeUsed: boolean): CardDataBuilder {
        this.cardData.canBeUsed = canBeUsed;

        return this;
    }

    public setCanBeCombed(canBeCombed: boolean): CardDataBuilder {
        this.cardData.canBeCombed = canBeCombed;

        return this;
    }

    public setSelectedColor(selectedColor: CardColors): CardDataBuilder {
        this.cardData.selectedColor = selectedColor;

        return this;
    }

    public setPossibleColors(possibleColors: ColorMap): CardDataBuilder {
        this.cardData.possibleColors = possibleColors;

        return this;
    }

    public build(): CardData {
        return this.cardData;
    }
}
