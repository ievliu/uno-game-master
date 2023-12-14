import SocketService from "@/Services/SocketService"

import {
	GameRoundEvents,
	GameRoundCounter,
} from "@uno-game/protocols"

import GameRoundRepository from "@/Repositories/GameRoundRepository"

class GameRoundService implements Service {
	async getRoundRemainingTimeInSeconds (gameId: string): Promise<number> {
		const gameRoundCounter = await GameRoundRepository.getGameRoundCounter(gameId)

		if (gameRoundCounter) {
			const { initializedAtMilliseconds, timeInSeconds } = gameRoundCounter

			const currentTimeInMilliseconds = Date.now()

			const passedTimeInSeconds = ((currentTimeInMilliseconds - initializedAtMilliseconds) / 1000)

			if (passedTimeInSeconds > timeInSeconds) {
				return timeInSeconds
			}

			const remainingTimeInSeconds = Math.round(timeInSeconds - passedTimeInSeconds)

			return remainingTimeInSeconds
		}

		return null
	}

	async resetRoundCounter (gameId: string, roundCounter: GameRoundCounter): Promise<void> {
		const currentRoundCounter = await GameRoundRepository.getGameRoundCounter(gameId)

		if (currentRoundCounter) {
			const oldTimeoutId = currentRoundCounter.timeoutId
			const oldIntervalId = currentRoundCounter.intervalId

			clearTimeout(oldTimeoutId)
			clearInterval(oldIntervalId)
		}

		const roundCounterInMilliseconds = roundCounter.timeInSeconds * 1000

		const newTimeoutId = setTimeout(() => {
			roundCounter.timeoutAction(gameId)
		}, roundCounterInMilliseconds)

		const newIntervalId = setInterval(() => {
			roundCounter.intervalAction(gameId)
		}, 1000)

		await GameRoundRepository.setGameRoundCounterData(gameId, {
			...roundCounter,
			timeoutId: newTimeoutId,
			intervalId: newIntervalId,
			initializedAtMilliseconds: Date.now(),
		})
	}

	async removeRoundCounter (gameId: string): Promise<void> {
		const currentRoundCounter = await GameRoundRepository.getGameRoundCounter(gameId)

		if (currentRoundCounter) {
			const oldTimeoutId = currentRoundCounter.timeoutId
			const oldIntervalId = currentRoundCounter.intervalId

			clearTimeout(oldTimeoutId)
			clearInterval(oldIntervalId)

			await GameRoundRepository.deleteGameRoundCounter(gameId)
		}
	}

	emitGameRoundEvent<Data extends unknown> (gameId: string, event: GameRoundEvents, data: Data) {
		SocketService.emitRoomEvent("game", gameId, event, data)
	}

	sendMessage() {
		return "Your time will run out soon"
	}
	receiveMessage(message: string) {
		if (message[0] == "T") {
			const gameRoundCounter =  GameRoundRepository.getGameRoundCounter("t1222")

		if (gameRoundCounter) {

			const currentTimeInMilliseconds = Date.now()

			const passedTimeInSeconds = ((currentTimeInMilliseconds) / 1000)

			if (passedTimeInSeconds > 1000) {
				return passedTimeInSeconds
			}

			const remainingTimeInSeconds = Math.round(10000 - passedTimeInSeconds)

			return remainingTimeInSeconds
		}

		return null
		}
	}
}

export default new GameRoundService()
