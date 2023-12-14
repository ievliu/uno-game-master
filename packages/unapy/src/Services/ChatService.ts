import SocketService from "@/Services/SocketService"
import PlayerService from "@/Services/PlayerService"

import CryptUtil from "@/Utils/CryptUtil"

import {
	Chat,
	ChatMessage,
	ChatEvents,
	NewMessageEventData,
} from "@uno-game/protocols"

import ChatRepository from "@/Repositories/ChatRepository"
import GameService from "./GameService"
import GameRepository from "@/Repositories/GameRepository"

class ChatService {
	async setupChat (playerId: string): Promise<Chat> {
		const playerData = await PlayerService.getPlayerData(playerId)

		const chat: Chat = {
			id: CryptUtil.makeShortUUID(),
			title: playerData.name,
			messages: [],
		}

		await this.createChat(chat)

		return chat
	}

	async chatExists (chatId: string): Promise<boolean> {
		const chat = await ChatRepository.getChat(chatId)

		if (chat) {
			return true
		} else {
			return false
		}
	}

	async retrieveChat (chatId: string): Promise<Chat> {
		const chat = await ChatRepository.getChat(chatId)
		console.log(chat)
		return chat
	}

	async joinChat (chatId: string): Promise<Chat> {
		const chat = await ChatRepository.getChat(chatId)

		return chat
	}

	private async createChat (chatData: Chat): Promise<void> {
		await ChatRepository.createChat(chatData)
	}

	async pushMessage (playerId: string, chatId: string, content: string): Promise<void> {
		const player = await PlayerService.getPlayerData(playerId)

		const id = CryptUtil.makeUUID()

		const message: ChatMessage = {
			playerId,
			playerName: player.name,
			content,
			date: Date.now(),
			id,
		}

		const games = await GameRepository.getGameList();

		const game = games.map(game => {
			if(game.chatId == chatId) {
				return game
			}
			return null
		});

		const gameId = game[0].id;
		const players = game[0].players;
		const operands = content.split(" ");

		const playerData = players.filter(player => {
			if(player.id == playerId) {
				return player
			}
		})

		if (operands[0] === "buy") {
			if (playerData[0].canBuyCard && playerData[0].isCurrentRoundPlayer) {
				GameService.buyCard(playerId, gameId)
			} else {
				message.content = message.playerName + " " + message.content + " - Player can't buy cards"
				message.playerName = "Server"
			}
		} else if (operands[0] === "clone") {
			if (playerData[0].canCloneCard && playerData[0].isCurrentRoundPlayer) {
				GameService.cloneCard(playerId, gameId)
			} else {
				message.content = message.playerName + " " + message.content + " - Player can't clone cards"
				message.playerName = "Server"
			}
		} else if (operands[0] === "put") {
			if (playerData[0].isCurrentRoundPlayer) {
				const playerCards = playerData[0].handCards
				if (operands[1] && operands[2]) {
					const cardId = playerCards.filter(card => {
						if(card.color === operands[1] && card.type === operands[2]) {
							return card;
						}
					});
					const cards = cardId.map(card => {
						return card.id;
					});
					if (cards) {
						GameService.putCard(playerId, cards, gameId, "green");
					} else {
						message.content = message.playerName + " " + message.content + " - Player doesn't have this card"
						message.playerName = "Server"
					}
				} else {
					message.content = message.playerName + " " + message.content + " - Not full command"
					message.playerName = "Server"
				}
			} else {
				message.content = message.playerName + " " + message.content + " - Not your turn"
				message.playerName = "Server"
			}
			
		} else {
			message.content = message.playerName + " " + message.content + " - Command does not exist"
			message.playerName = "Server"
		}

		await ChatRepository.pushMessageToChat(chatId, message)

		this.emitChatEvent<NewMessageEventData>(chatId, "NewMessage", {
			chatId,
			message,
		})
	}

	private emitChatEvent<Data extends unknown> (chatId: string, event: ChatEvents, data: Data) {
		SocketService.emitRoomEvent("chat", chatId, event, data)
	}
}

export default new ChatService()
