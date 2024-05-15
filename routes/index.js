const User = require("../models/user");
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController')
var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Members Only Project' });
// });
router.get("/", messageController.index);

// router.get('/sign-up', (req, res) => res.render("sign-up"));
router.get('/sign-up', userController.user_create_get);
router.post('/sign-up', userController.user_create_post);

router.get('/join-club', userController.user_join_club_get);
router.post('/join-club', userController.user_join_club_post);

router.get('/log-in', userController.user_log_in_get);
router.post('/log-in', userController.user_log_in_post);

module.exports = router;
