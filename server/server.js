const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)

const QueriesHandler = require('./js/SocketHandlers/QueriesHandler')
const PlayHandler = require('./js/SocketHandlers/PlayHandler')

const Logger = require('./js/Logger/Logger')

const SERVER_PORT = 8080

// Express routing
//=================================================

// express routing for debug & test
app.get('/infos', (req, res) => {
    const playersStr = Object.values(players).map((pl) =>
    {
        return `${pl.socket.id} => ${pl.name}<br>`
    })
    const gameStr = `${game.gameInstance ? '<span style="color: green">started</span>' : '<span style="color: red">not started</span>'}<br>Players:<br>${game.players.map(p => `${p.playerID} => ${p.name}<br>`)}`

    const result = `<strong>Players</strong><br>
        ${playersStr}<br>
        <br>
        <strong>Game</strong><br>
        ${gameStr}
    `
    res.send(result)
})

// express routing for client serving
app.use(express.static(path.join(__dirname + '/../client/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/dist/index.html'))
})

// Socket.io server
//=================================================

/**
 * @typedef {Object} GameObj
 * @property {string} playerIDs list of socket ID of all the players
 * @property {(Game|null)} gameInstance the Game instance. null if not started
 */
const game = {
    gameInstance: null,
    players: []
}

/**
 * @typedef {Object} PlayerObj
 * @property {socket} socket the players's io socket
 * @property {string} name the players's name. Unique
 */
const players = {}

io.on('connection', (socket) =>
{
    Logger.log(socket.id, 'new connection !')

    const queriesHandler = new QueriesHandler(io, socket, players, game)
    queriesHandler.bindSockets()

    const playHandler = new PlayHandler(io, socket, players, game)
    playHandler.bindSockets()

    // Case of re-connection
    if (game.gameInstance && socket.handshake.query && socket.handshake.query.playerID)
    {
        const gamePlayer = game.players.find((pl) => pl.socket === null && pl.playerID === socket.handshake.query.playerID)
        if (gamePlayer)
        {
            Logger.log(socket.id, 'reconnecting to the game')

            // Reconnect the player by setting back its socket
            gamePlayer.socket = socket
            socket.emit('reconnection')
        }
    }
    
    // Disconnect
    socket.on('disconnect', () => {
        Logger.log(socket.id, 'Disconnection !')

        const pendingPlayer = players[socket.id]
        const gamePlayer = game.players.find((pl) => (pl.socket && (pl.socket.id === socket.id)))

        if (pendingPlayer)
        {
            // Remove the player
            delete players[socket.id]
            
            // Send an event to all players
            io.emit('playerListUpdated', Object.values(players).map(pl => ({ name: pl.name })))
        }
        else if (gamePlayer)
        {
            // Disconnect the player by removing its socket
            gamePlayer.socket = null

            // Kill the game if last player disconnects
            if (game.players.every(pl => !pl.socket))
            {
                Logger.gameLog('Killing the game as the last player left.')
                game.gameInstance = null
                game.players = []
            }
        }
    })
})

server.listen(SERVER_PORT)
Logger.serverLog(`Server running at localhost:${SERVER_PORT}/`)
