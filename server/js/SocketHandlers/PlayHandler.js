'use strict'

const { v4: uuid } = require('uuid')

const Logger = require('../Logger/Logger')
const Helpers = require('./Helpers')

const Game = require('../GameElements/Game')

const MIN_PLAYERS = 5
const MAX_PLAYERS = 10

module.exports = class PlayHandler {
    constructor(io, socket, players, game) {
        this.io = io
        this.socket = socket
        this.players = players
        this.game = game
    }

    bindSockets() {
        this.startGame = this.startGame.bind(this)

        this.socket.on('startGame', this.startGame)
    }
    
    // Socket functions
    //===================================

    startGame() {
        Logger.log(this.socket.id, 'requesting to start the game')

        if (this.game.gameInstance)
        {
            Helpers.sendError(this.socket, '008')
            return
        }

        if (Object.keys(this.players).length >= MIN_PLAYERS && Object.keys(this.players).length <= MAX_PLAYERS)
        {
            // Transfer players
            this.game.players = Object.values(this.players)
            Object.keys(this.players).forEach((key) =>
            {
                delete this.players[key]
            })

            // Start the game
            this.game.gameInstance = new Game()
            this.game.gameInstance.init({
                players: this.game.players.map(pl => ({name: pl.name}))
            })
            
            // send the information to all players that the game has started
            this.game.players.forEach((player =>
            {
                player.playerID = uuid()
                player.socket.emit('gameStarted', { playerID: player.playerID })
            }))

            Logger.log(this.socket.id, 'game started !')
        }
        else
        {
            Helpers.sendError(this.socket, '006', { min: MIN_PLAYERS, max: MAX_PLAYERS })
        }
    }

    // Helpers
    //===================================

    /**
     * Generate a new up-to-date state for the given game, and push it to the 2 client players
     * @param {GameObj} game the game for which we want to update the state
     * @param {object} changes changes that lead to the new game state
     */
    updateGameState(changes = []) {
        if (this.game.gameInstance)
        {
            Logger.serverLog('pushing a new game state for all players')
            
            // send the game state to all players
            this.game.players.forEach((player =>
            {
                if (player.socket)
                {
                    const finalState = this.game.gameInstance.serialize(player.name)
                    player.socket.emit('gameState_push', { finalState, changes })
                }
            }))
        }
        else
        {
            Helpers.sendError(this.socket, '003')
        }
    }

    /**
     * Get the current player infos
     */
    getPlayer() {
        return this.game.players.find((pl) => (pl.socket && (pl.socket.id === this.socket.id)))
    }

    /**
     * Check if the player exists
     * @returns {boolean} tells if the player exists
     */
    playerExists() {
        return !!this.getPlayer()
    }

    /**
     * Returns the request context if the request is valid, null otherwise. It also displays server logs if there are errors
     * @returns {object} the context
     */
    canRequest() {
        // check if player exists
        if (!this.playerExists()) {
            Helpers.sendError(this.socket, '001')
            return null
        }

        // check if game has started
        if (!this.game.gameInstance) {
            Helpers.sendError(this.socket, '003')
            return null
        }

        return true
    }
}

