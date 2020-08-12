'use strict'
/* eslint-disable no-console */

const chalk = require('chalk')
const PAD = 22

module.exports = {
    log(prefix = '', ...args) {
        console.log(chalk.black.bold(prefix.padEnd(PAD)), '>', ...args)
    },

    gameLog(...args) {
        const content = args.map((a) => chalk.magenta.bold(a)).join(' ')
        console.log(chalk.magenta.bold('GAME'.padEnd(PAD)) + ' > ' + content)
    },

    serverLog(...args) {
        const content = args.map((a) => chalk.green.bold(a)).join(' ')
        console.log(chalk.green.bold('SERVER'.padEnd(PAD)) + ' > ' + content)
    },

    warn(prefix = '', ...args) {
        const content = args.map((a) => chalk.yellow.bold(a)).join(' ')
        console.warn(chalk.yellow.bold(prefix.padEnd(PAD)) + ' > ' + content)
    },

    error(prefix = '', ...args) {
        const content = args.map((a) => chalk.red.bold(a)).join(' ')
        console.error(chalk.red.bold(prefix.padEnd(PAD)) + ' > ' + content)
    },

    gameError(...args) {
        const content = args.map((a) => chalk.red.bold(a)).join(' ')
        console.log(chalk.red.bold('GAME'.padEnd(PAD)) + ' > ' + content)
    }
}