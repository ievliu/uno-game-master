import { Player } from "@uno-game/protocols"

import PlayerRepository from "@/Repositories/PlayerRepository"

import CryptUtil from "@/Utils/CryptUtil"

class PlayerService implements Service {
	async setPlayerData (playerData: Player): Promise<Player> {
		const player = {
			id: playerData.id || CryptUtil.makeUUID(),
			name: playerData.name,
		}

		await PlayerRepository.setPlayerData(player)

		return player
	}

	async getPlayerData (playerId: string): Promise<Player> {
		return await PlayerRepository.getPlayerData(playerId)
	}

	async playerExists (playerId: string): Promise<boolean> {
		const player = await PlayerRepository.getPlayerData(playerId)

		if (player) {
			return true
		} else {
			return false
		}
	}

	async getAllPlayerIds (): Promise<string[]> {
		const playerIds = await PlayerRepository.getAllPlayerIds()

		return playerIds
	}


	sendMessage() {
		return "Player has uno"
	}
	async receiveMessage(message: string) {
		if (message[0]=="P") {
			const player = await this.getPlayerData(message);
			this.setPlayerData(player);
		}
	}
}

export default new PlayerService()
