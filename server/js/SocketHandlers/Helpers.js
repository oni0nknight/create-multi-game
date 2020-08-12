'use strict'

const Logger = require('../Logger/Logger')
const ErrorCodes = require('../ErrorCodes')

const HEXA_BASE = 16

const Helpers = {
    
    sendError(socket, errorCode, args = {}) {
        let errorMsg = ErrorCodes.get(errorCode)
        Object.keys(args).forEach((key) =>
        {
            errorMsg = errorMsg.replace(`{{${key}}}`, args[key])
        })
        Logger.error(socket.id, 'ERROR => ' + errorMsg)
        
        socket.emit('err', {
            code: errorCode,
            msg: errorMsg
        })
    },

    replyError(socket, query, errorCode, args = {}) {
        let errorMsg = ErrorCodes.get(errorCode)
        Object.keys(args).forEach((key) =>
        {
            errorMsg = errorMsg.replace(`{{${key}}}`, args[key])
        })
        Logger.error(socket.id, 'ERROR => ' + errorMsg)
        
        socket.emit(query + '_error', {
            code: errorCode,
            msg: errorMsg
        })
    },
    
    generateUUID() {
        return 'xxxxxxxx-game-xxxxxxxx'.replace(/[x]/g, () => {
            return (Math.random() * HEXA_BASE | 0).toString(HEXA_BASE)
        })
    }
}

module.exports = Helpers