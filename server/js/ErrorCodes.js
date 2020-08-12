'use strict'

const errors =
{
    // General errors
    //=============================================

    '000' : 'Unhandled error',
    '001' : 'You must be register in the game to perform this action.',
    '003' : 'The game must be started to perform this action.',
    '004' : 'Enter a valid name.',
    '005' : 'Vous ne pouvez pas effectuer cette action avec votre rôle.',
    '006' : 'This game accepts between {{min}} and {{max}} players',
    '008' : 'A game is already running. Wait for it to end.',
}

function get(errorCode) {
    return errors[errorCode] ? errors[errorCode] : errors['000']
}

module.exports = {
    get
}