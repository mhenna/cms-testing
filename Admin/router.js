const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('/ping').get(controller.ping)
router.route('/users').get(controller.getUsers)
router.route('/test').get(controller.earlyBooking)
router.route('/editUser').post(controller.editUser)
// router.route('/test').get(controller.sendNotificationsToUsers)

module.exports = router