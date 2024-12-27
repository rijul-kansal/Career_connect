const express = require('express');
const AuthController = require('./../Controller/AuthController');
const UserController = require('./../Controller/UserController');
const multer= require('multer')
const router = express.Router();

router.use(AuthController.protect);
router.route('/').patch(UserController.updateMe);
router.route('/').get(UserController.getMe);
router.route('/').delete(UserController.deleteMe);
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
router.route('/attachment').post(upload.array("image",2),UserController.updateImageOrResume)
module.exports = router;
