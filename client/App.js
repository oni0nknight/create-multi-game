import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Home'
import Lobby from './components/Lobby'
import GameContainer from './components/GameContainer'
import ErrorHandler from './components/ErrorHandler'

import { ClientProvider } from './context/ClientContext'
import { GameProvider } from './context/GameContext'

const App = () => {
    return (
        <ClientProvider>
            <GameProvider>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Header} />
                        <Route path="/lobby" component={Header} />
                    </Switch>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/lobby" component={Lobby} />
                    </Switch>
                    <Switch>
                        <Route path="/game" component={GameContainer} />
                    </Switch>
                </Router>

                <ErrorHandler />
            </GameProvider>
        </ClientProvider>
    )
}

window.onload = () => {
    ReactDOM.render(<App />, document.getElementById('app'))
}