'use strict'

const fs = require('fs')
const path = require('path')

const configJson = fs.readFileSync(path.resolve(__dirname, '../config.json'));
const config = JSON.parse(configJson)

module.exports = { config }
