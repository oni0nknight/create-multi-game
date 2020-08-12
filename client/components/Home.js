import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { Paper, TextField, Button } from '@material-ui/core'

import { ClientContext } from '../context/ClientContext'
import { GameContext } from '../context/GameContext'

import Constants from '../js/Constants'

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '80vh',
        overflowX: 'auto',
        textAlign: 'center'
    },
    form: {
        margin: theme.spacing(3),
        textAlign: 'center'
    },
    field: {
        marginBottom: theme.spacing(3)
    }
}))

const Home = () => {
    const [playerName, setPlayerName] = useState('')
    const [redirectPath, setRedirectPath] = useState(null)
    const classes = useStyles()

    const client = useContext(ClientContext)
    const gameContext = useContext(GameContext)

    // Form submit handler
    const register = useCallback((e) =>
    {
        e.preventDefault()
        const name = playerName.trim()

        // Check validity of the form
        if (name.length > 0)
        {
            // Register the player to the server
            client.query('register', { name }).then((player) =>
            {
                // Add the player name in the game context
                gameContext.playerName = player.playerName

                // Redirect to the right page
                setRedirectPath(`/lobby`)
            })
        }
    }, [playerName])

    useEffect(() => {
        if (client.isReconnecting)
        {
            setRedirectPath('/game')
        }
    }, [])

    return (
        <Paper elevation={0} square className={classes.container}>
            <form className={classes.form} onSubmit={register}>
                <TextField
                    id="playerName"
                    label="Nom du joueur"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value.slice(0, Constants.MAX_NAME_LENGTH))}
                    className={classes.field}
                />
                <br />
                <Button variant="contained" color="primary" onClick={register}>
                    Inscription
                </Button>
            </form>
            {redirectPath !== null && <Redirect to={redirectPath} push={true} />}
        </Paper>
    )
}

export default Home