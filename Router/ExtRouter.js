const express = require('express')
const Controller = require('./../Controller/ExtController')
const router = express.Router()

router.route('/getStates').post(Controller.getState)

module.exports = router

