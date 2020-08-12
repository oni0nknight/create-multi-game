import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import {
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from '@material-ui/core'

import AvatarIcon from '@material-ui/icons/Person'

import { ClientContext } from '../context/ClientContext'
import { GameContext } from '../context/GameContext'

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '80vh',
        overflowX: 'auto',
        textAlign: 'center'
    },
    form: {
        margin: 'auto',
        marginTop: theme.spacing(3),
        width: '30%'
    },
    playerList: {
        marginBottom: theme.spacing(2),
        backgroundColor: '#fafafa'
    },
    options: {
        marginBottom: theme.spacing(2)
    }
}))

const Lobby = () => {
    const [pendingPlayers, setPendingPlayers] = useState([])
    const [redirectPath, setRedirectPath] = useState(null)
    const classes = useStyles()

    const client = useContext(ClientContext)
    const gameContext = useContext(GameContext)

    useEffect(() => {
        if (client.isReconnecting)
        {
            setRedirectPath('/game')
        }
        else if (!gameContext.playerName)
        {
            setRedirectPath('/')
        }
    }, [])

    useEffect(() => {
        const refreshPendingPlayers = () =>
        {
            // Fetch all pending games from the server
            return client.query('players').then((players) => {
                // Set the list of pending games
                setPendingPlayers(players)
            })
        }

        const gameStarted = ({ playerID }) =>
        {
            localStorage.setItem('playerID', playerID)
            localStorage.setItem('playerName', gameContext.playerName)
            setRedirectPath(`/game`)
        }

        // Initialize the pending games list
        refreshPendingPlayers()

        // Subscribe to game list updates
        client.subscribe('playerListUpdated', refreshPendingPlayers)
        client.subscribe('gameStarted', gameStarted)
        return () => {
            client.unsubscribe('playerListUpdated', refreshPendingPlayers)
            client.unsubscribe('gameStarted', gameStarted)
        }
    }, [])

    // Form submit handler
    const start = useCallback((e) =>
    {
        e.preventDefault()
        client.call('startGame')
    }, [pendingPlayers])

    return (
        <Paper elevation={0} square className={classes.container}>
            <form className={classes.form} noValidate autoComplete="off">
                <List className={classes.playerList}>
                    {pendingPlayers.map((player) => (
                        <ListItem key={player.name} >
                            <ListItemAvatar>
                                <Avatar>
                                    <AvatarIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={player.name} />
                        </ListItem>
                    ))}
                </List>
                <br/>
                <Button variant="contained" color="primary" onClick={start}>
                    Lancer la partie
                </Button>
            </form>
            {redirectPath !== null && <Redirect to={redirectPath} push={true} />}
        </Paper>
    )
}

export default Lobby