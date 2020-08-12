'use strict'

const Helpers = require('./Helpers')
const Logger = require('../Logger/Logger')

let uniqueID = 0

const Constants = require('../GameElements/Constants')

module.exports = class QueriesHandler {
    constructor(io, socket, players, game) {
        this.io = io
        this.socket = socket
        this.players = players
        this.game = game
    }

    bindSockets() {
        this.register = this.register.bind(this)
        this.getPlayers = this.getPlayers.bind(this)
        this.getGameState = this.getGameState.bind(this)

        this.socket.on('register', this.register)
        this.socket.on('players', this.getPlayers)
        this.socket.on('gameState', this.getGameState)
    }


    // Socket functions
    //===================================

    register(data) {
        Logger.log(this.socket.id, 'requesting to register player.')

        if (data.name && data.name.length > 0)
        {
            let playerName = data.name.slice(0, Constants.MAX_NAME_LENGTH)
            playerName += Object.keys(this.players).some(id => this.players[id].name === playerName) ? '#' + (uniqueID++).toString() : ''
            Logger.log(this.socket.id, 'Player registered with name ' + data.name)

            this.players[this.socket.id] = {
                socket: this.socket,
                name: playerName
            }

            // Send an event to all players
            this.io.emit('playerListUpdated')

            // validate the register
            this.socket.emit('register_response', { playerName })
        }
        else
        {
            Helpers.replyError(this.socket, 'register', '004')
        }
    }

    getPlayers() {
        Logger.log(this.socket.id, 'requesting players')
        const data = Object.values(this.players).map(pl => ({ name: pl.name }))
        this.socket.emit('players_response', data)
    }

    getGameState() {
        Logger.log(this.socket.id, 'requesting game state')
        if (!this.canRequest('gameState'))
        {
            return
        }

        const player = this.getPlayer()
        const finalState = this.game.gameInstance.serialize(player.name)
        this.socket.emit('gameState_response', { finalState, changes: [] })
    }


    // Helpers
    //===================================

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
    canRequest(query) {
        // check if player exists
        if (!this.playerExists()) {
            Helpers.replyError(this.socket, query, '001')
            return null
        }

        // check if game has started
        if (!this.game.gameInstance) {
            Helpers.replyError(this.socket, query, '003')
            return null
        }

        return true
    }

}