'use strict'

const Serializable = require('./Serializable')

module.exports = class Player extends Serializable {
    /**
     * @constructor
     */
    constructor(name) {
        super()
        this.name = name
    }

    serialize() {
        return {
            name: this.name
        }
    }
}