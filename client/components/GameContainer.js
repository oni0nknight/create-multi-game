import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'

import { ClientContext } from '../context/ClientContext'
import { GameContext } from '../context/GameContext'

import Game from '../js/Game'

const GameContainer = () => {
    const [redirectPath, setRedirectPath] = useState(null)

    const client = useContext(ClientContext)
    const gameContext = useContext(GameContext)

    useEffect(() => {
        let game = null
        
        setTimeout(() =>
        {
            if (!client.isReconnecting && !gameContext.playerName)
            {
                setRedirectPath('/')
            }
            else
            {
                // Create the Phaser game
                game = new Game(client)
                const playerName = gameContext.playerName || localStorage.getItem('playerName')
                game.initialize(playerName)
            }
        }, 300) // eslint-disable-line no-magic-numbers

        return () => {
            if (game)
            {
                game.destroy()
            }
        }
    }, [])

    return (
        <>
            {redirectPath !== null && <Redirect to={redirectPath} push={true} />}
        </>
    )
}

export default GameContainer