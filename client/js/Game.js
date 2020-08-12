import Phaser from 'phaser'

// Helpers
import cst from './Constants'
const {
    GAME
} = cst

export default class Game {
    constructor(client) {
        this.game = null
        this.scene = null
        this.client = client
        
        this.playerName = null

        this.gameState = null

        this.gameObjects = {
        }
    }

    initialize(playerName) {
        this.playerName = playerName

        const config = {
            type: Phaser.AUTO,
            parent: 'app',
            scene: {
                init: this.init.bind(this),
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this)
            },
            scale: {
                mode: Phaser.Scale.FIT,
                width: GAME.WIDTH,
                height: GAME.HEIGHT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        }
        
        this.game = new Phaser.Game(config)
    }

    // Phaser lifecycle
    //============================================

    init() {
        this.scene = this.game.scene.getScene('default')
    }

    preload() {
        
    }

    create() {
        // subscibe to events
        this.client.subscribe('gameState_push', this.receiveState)

        // init game state
        this.updateGameState()
    }

    update() {
    }

    destroy() {
        // unsubscribe to events
        this.client.unsubscribe('gameState_push', this.receiveState)

        // destroy Phaser game
        this.game.destroy(true)
    }

    // Response handler
    //============================================

    receiveState(response) {
        this.gameState = response.finalState

        // Refresh the view
        this.refresh()
    }

    // Helpers
    //============================================

    async updateGameState() {
        const response = await this.client.query('gameState')
        this.receiveState(response)
    }

    // View creation
    //============================================

    refresh() {
        
    }

    // Input handlers
    //============================================
}