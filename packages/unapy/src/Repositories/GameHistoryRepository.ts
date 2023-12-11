import { Store } from "@/Protocols/StoreProtocol";
import AsyncMapStoreService from "@/Services/AsyncMapStoreService";
import GameHistoryService from "@/Services/GameHistoryService";
import { GameHistory } from "@uno-game/protocols";

class GameRepository {
    private static gameHistories: Store<GameHistory[]> =
        new AsyncMapStoreService();

    static async setGameHistory(
        playerId: string,
        gameHistory: GameHistory[]
    ): Promise<void> {
        await this.gameHistories.set(playerId, gameHistory);
        GameHistoryService.saveMemento(playerId, gameHistory);
    }

    static async getGameHistory(playerId: string): Promise<GameHistory[]> {
        const gameHistory = await this.gameHistories.getOne(playerId);

        if (!gameHistory) {
            return GameHistoryService.restoreMemento(playerId) || [];
        }

        return gameHistory;
    }
}

export default GameRepository;
