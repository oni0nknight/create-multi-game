'use strict'

const Serializable = require('./Serializable')
const Player = require('./Player')

module.exports = class Game extends Serializable {
    /**
     * @constructor
     */
    constructor() {
        super()

        /**
         * @type {Array.<Player>} Array of player names
         */
        this.players = []

        /**
         * Whose turn it is to play
         * @type {Number} number between 0 and this.players.length - 1
         */
        this.turnIndex = -1
    }

    init ({ players }) {
        // Draw roles
        this.players = players.map((player) =>
        {
            return new Player(player.name)
        })

        // Pick randomly the first player
        this.turnIndex = Math.floor(Math.random() * this.players.length)
    }

    // Helpers
    //==============================================================

    serialize() {
        const serializedPlayers = this.players.map((pl) =>
        {
            return pl.serialize()
        })

        return {
            players: serializedPlayers,
            turnIndex: this.turnIndex
        }
    }
}