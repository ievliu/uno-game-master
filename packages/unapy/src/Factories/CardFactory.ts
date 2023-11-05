import staticFilesConfig from "@/Config/static-files";
import {
    CardColors,
    CardData,
    CardDataBuilder,
    CardTypes,
} from "@uno-game/protocols";
import uuid from "uuid";

export class CardFactory {
    createNormalCard(cardType: CardTypes, cardColor: CardColors): CardData {
        const cardPictureSrc = this.buildCardPictureSrc(cardType, cardColor);
        const cardId = uuid.v4();

        return new CardDataBuilder()
            .setId(cardId)
            .setSrc(cardPictureSrc)
            .setName(`${cardType}-${cardColor}`)
            .setColor(cardColor)
            .setType(cardType)
            .build();
    }

    createBuyFourCard(): CardData {
        const blackCardPictureSrc = this.buildCardPictureSrc("buy-4", "black");
        const redCardPictureSrc = this.buildCardPictureSrc("buy-4", "red");
        const blueCardPictureSrc = this.buildCardPictureSrc("buy-4", "blue");
        const yellowCardPictureSrc = this.buildCardPictureSrc(
            "buy-4",
            "yellow"
        );
        const greenCardPictureSrc = this.buildCardPictureSrc("buy-4", "green");

        const possibleColors = {
            red: redCardPictureSrc,
            blue: blueCardPictureSrc,
            yellow: yellowCardPictureSrc,
            green: greenCardPictureSrc,
            black: blackCardPictureSrc,
        };

        const cardId = uuid.v4();

        return new CardDataBuilder()
            .setId(cardId)
            .setSrc(blackCardPictureSrc)
            .setName("buy-4")
            .setColor("black")
            .setType("buy-4")
            .setSelectedColor(null)
            .setPossibleColors(possibleColors)
            .build();
    }

    createChangeColorCard(): CardData {
        const blackCardPictureSrc = this.buildCardPictureSrc(
            "change-color",
            "black"
        );
        const redCardPictureSrc = this.buildCardPictureSrc(
            "change-color",
            "red"
        );
        const blueCardPictureSrc = this.buildCardPictureSrc(
            "change-color",
            "blue"
        );
        const yellowCardPictureSrc = this.buildCardPictureSrc(
            "change-color",
            "yellow"
        );
        const greenCardPictureSrc = this.buildCardPictureSrc(
            "change-color",
            "green"
        );

        const possibleColors = {
            red: redCardPictureSrc,
            blue: blueCardPictureSrc,
            yellow: yellowCardPictureSrc,
            green: greenCardPictureSrc,
            black: blackCardPictureSrc,
        };

        const cardId = uuid.v4();

        return new CardDataBuilder()
            .setId(cardId)
            .setSrc(blackCardPictureSrc)
            .setName("change-color")
            .setColor("black")
            .setType("change-color")
            .setSelectedColor(null)
            .setPossibleColors(possibleColors)
            .build();
    }

    private buildCardPictureSrc(
        cardType: CardTypes,
        cardColor: CardColors
    ): string {
        const baseUrl = staticFilesConfig.staticFilesBaseUrl;

        const picturePath = `cards/${cardType}/${cardColor}.svg`;

        return `${baseUrl}/${picturePath}`;
    }
}
