const User = require("../models/user");
const userController = require('../controllers/userController');
var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only Project' });
});

// router.get('/sign-up', (req, res) => res.render("sign-up"));
router.get('/sign-up', userController.user_create_get);
router.post('/sign-up', userController.user_create_post);

module.exports = router;
