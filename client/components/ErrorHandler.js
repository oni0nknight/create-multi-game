import React, { useState, useEffect, useContext } from 'react'

import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { ClientContext } from '../context/ClientContext'


const ErrorHandler = () => {
    const [ open, setOpen ] = useState(false)
    const [ error, setError ] = useState('')
    const client = useContext(ClientContext)

    useEffect(() =>
    {
        client.subscribe('err', onError)

        return () =>
        {
            client.unsubscribe('err', onError)
        }
    }, [])
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    const onError = ({ code, msg }) => {
        setError(msg)
        setOpen(true)
    }

    return (
        <>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert elevation={6} variant="filled" onClose={handleClose} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </>
    )
}


export default ErrorHandler