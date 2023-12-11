import { GameHistory } from "@uno-game/protocols";
import GameService from "@/Services/GameService";
import GameHistoryRepository from "@/Repositories/GameHistoryRepository";

class GameHistoryService {
    private gameMementos: Map<string, GameHistory[]> = new Map();

    async retrieveGameHistory(playerId: string): Promise<GameHistory[]> {
        const gameHistory = await this.consolidateGameHistory(playerId);

        return gameHistory;
    }

    private async consolidateGameHistory(
        playerId: string
    ): Promise<GameHistory[]> {
        const gameHistory =
            (await GameHistoryRepository.getGameHistory(playerId)) || [];

        const consolidatedGameHistory: GameHistory[] = [];

        const games = await GameService.getGameList();

        gameHistory.forEach((history) => {
            const game = games.find((game) => game.id === history.gameId);

            if (game) {
                consolidatedGameHistory.push({
                    createdAt: game.createdAt,
                    gameId: game.id,
                    name: game.title,
                    playersCount: game.players.length,
                    status: game.status,
                });
            }
        });

        games
            .filter((game) =>
                game.players.some((player) => player.id === playerId)
            )
            .filter(
                (game) =>
                    !consolidatedGameHistory.some(
                        (history) => history.gameId === game.id
                    )
            )
            .forEach((game) => {
                consolidatedGameHistory.push({
                    createdAt: game.createdAt,
                    gameId: game.id,
                    name: game.title,
                    playersCount: game.players.length,
                    status: game.status,
                });
            });

        return consolidatedGameHistory;
    }

    saveMemento(playerId: string, gameHistory: GameHistory[]): void {
        this.gameMementos.set(playerId, [...gameHistory]);
    }

    restoreMemento(playerId: string): GameHistory[] | undefined {
        return this.gameMementos.get(playerId);
    }
}

export default new GameHistoryService();
