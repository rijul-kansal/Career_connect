const express = require('express')
const Controller = require('./../Controller/ExtController')
const router = express.Router()

router.route('/getStates').post(Controller.getState)
router.route('/getCity').post(Controller.getCity)

module.exports = router

