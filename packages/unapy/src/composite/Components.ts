import GameRepository from "@/Repositories/GameRepository";
import PlayerRepository from "@/Repositories/PlayerRepository";
import GameService from "@/Services/GameService";
import { Game } from "@uno-game/protocols";

abstract class Component {

    playerId: string
    gameId: string

    components: Component

    abstract execute(query: string);
    abstract addItem(operand: string);
    abstract getChild();
}

class Composite extends Component{
    executables: ExecutableCommand
    execute(query: string) {
        this.components.execute(query);
    }
    addItem(operand: string) {
        this.components.addItem(operand);
    }
    getChild() {
        this.components.getChild();
    }

}

class ExecutableCommand extends Component {
    execute(query: string) {
        const games = GameRepository.getGameList();

		const game = games[0]

		const gameId = game[0].id;
		const players = game[0].players;
        const playerData = players.filter(player => {
			if(player.id == this.playerId) {
				return player
			}
		})
        if (query === "buy") {
				GameService.buyCard(this.playerId, this.gameId)
		} else if (query === "clone") {
				GameService.cloneCard(this.playerId, this.gameId)
		} else if (query[0] === "put") {
			if (playerData[0].isCurrentRoundPlayer) {
				const playerCards = playerData[0].handCards
				if (query[1] && query[2]) {
					const cardId = playerCards.filter(card => {
						if(card.color === query[1] && card.type === query[2]) {
							return card;
						}
					});
					const cards = cardId.map(card => {
						return card.id;
					});
					if (cards) {
						GameService.putCard(this.playerId, cards, gameId, "green");
					} 
                }
            }
		}
    }
    addItem(operand: string) {
        throw new Error("Method not possible");
    }
    getChild() {
        throw new Error("Method not possible.");
    }

}




export default new Composite()
