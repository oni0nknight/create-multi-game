import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        height: '15vh',
        textAlign: 'center',
        backgroundColor: '#eee',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
}))

const Header = (props) => {
    const classes = useStyles()
    
    return (
        <div className={classes.container}>
            <h1>Game title</h1>
            <span>Welcome to the game</span>
        </div>
    )
}

Header.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}

export default withRouter(Header)