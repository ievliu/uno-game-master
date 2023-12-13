import staticFilesConfig from "@/Config/static-files";
import {
    CardColors,
    CardData,
    CardDataBuilder,
    CardTypes,
} from "@uno-game/protocols";
import uuid from "uuid";

class CardPictureFlyweight {
    private pictureSrc: string;

    constructor(cardType: CardTypes, cardColor: CardColors) {
        const baseUrl = staticFilesConfig.staticFilesBaseUrl;
        const picturePath = `cards/${cardType}/${cardColor}.svg`;
        this.pictureSrc = `${baseUrl}/${picturePath}`;
    }

    getPictureSrc(): string {
        return this.pictureSrc;
    }
}
class CardPictureFlyweightProxy {
    private realFlyweight: CardPictureFlyweight | null = null;

    constructor(private cardType: CardTypes, private cardColor: CardColors) {}

    getPictureSrc(): string {
        if (!this.realFlyweight) {
            this.realFlyweight = new CardPictureFlyweight(this.cardType, this.cardColor);
        }
        return this.realFlyweight.getPictureSrc();
    }
}
export class CardFactoryWithProxy {
    private flyweightProxies: Record<string, CardPictureFlyweightProxy> = {};

    private getFlyweightProxy(cardType: CardTypes, cardColor: CardColors): CardPictureFlyweightProxy {
        const key = `${cardType}-${cardColor}`;
        if (!this.flyweightProxies[key]) {
            this.flyweightProxies[key] = new CardPictureFlyweightProxy(cardType, cardColor);
        }
        return this.flyweightProxies[key];
    }

    createNormalCard(cardType: CardTypes, cardColor: CardColors): CardData {
        const flyweightProxy = this.getFlyweightProxy(cardType, cardColor);
        const cardId = uuid.v4();

        return new CardDataBuilder()
            .setId(cardId)
            .setSrc(flyweightProxy.getPictureSrc())
            .setName(`${cardType}-${cardColor}`)
            .setColor(cardColor)
            .setType(cardType)
            .build();
    }

    createBuyFourCard(): CardData {
        const flyweightProxy = this.getFlyweightProxy("buy-4", "black");
        const possibleColors = {
            red: this.getFlyweightProxy("buy-4", "red").getPictureSrc(),
            blue: this.getFlyweightProxy("buy-4", "blue").getPictureSrc(),
            yellow: this.getFlyweightProxy("buy-4", "yellow").getPictureSrc(),
            green: this.getFlyweightProxy("buy-4", "green").getPictureSrc(),
            black: flyweightProxy.getPictureSrc(),
        };

        const cardId = uuid.v4();

        return new CardDataBuilder()
            .setId(cardId)
            .setSrc(flyweightProxy.getPictureSrc())
            .setName("buy-4")
            .setColor("black")
            .setType("buy-4")
            .setSelectedColor(null)
            .setPossibleColors(possibleColors)
            .build();
    }

    createChangeColorCard(): CardData {
        const flyweightProxy = this.getFlyweightProxy("change-color", "black");
        const possibleColors = {
            red: this.getFlyweightProxy("change-color", "red").getPictureSrc(),
            blue: this.getFlyweightProxy("change-color", "blue").getPictureSrc(),
            yellow: this.getFlyweightProxy("change-color", "yellow").getPictureSrc(),
            green: this.getFlyweightProxy("change-color", "green").getPictureSrc(),
            black: flyweightProxy.getPictureSrc(),
        };

        const cardId = uuid.v4();

        return new CardDataBuilder()
            .setId(cardId)
            .setSrc(flyweightProxy.getPictureSrc())
            .setName("change-color")
            .setColor("black")
            .setType("change-color")
            .setSelectedColor(null)
            .setPossibleColors(possibleColors)
            .build();
    }
}