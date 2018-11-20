
const express = require("express");
const ControllerUser = require('../controllers/user');

const router = express.Router();

router.post('/signUp', ControllerUser.createUser);

router.post('/login', ControllerUser.loginUser);

module.exports = router;

