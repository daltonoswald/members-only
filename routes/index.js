const User = require("../models/user");
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController')
const isSignedIn = require('../authMiddleware').isSignedIn;
const isAdmin = require('../authMiddleware').isAdmin
var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Members Only Project' });
// });

// router.get("/", isSignedIn, messageController.index);
router.get("/", messageController.index);

// router.get('/sign-up', (req, res) => res.render("sign-up"));
router.get('/sign-up', userController.user_create_get);
router.post('/sign-up', userController.user_create_post);

router.get('/join-club', isSignedIn, userController.user_join_club_get);
router.post('/join-club', isSignedIn, userController.user_join_club_post);

router.get('/become-admin', isSignedIn, userController.user_become_admin_get);
router.post('/become-admin', isSignedIn, userController.user_become_admin_post);

router.get('/log-in', userController.user_log_in_get);
router.post('/log-in', userController.user_log_in_post);

router.get('/logout', isSignedIn, userController.user_logout);

router.get('/new-message', isSignedIn, messageController.new_message_get);
router.post('/new-message', isSignedIn, messageController.new_message_post);

router.get('/delete-message/:id', isSignedIn, isAdmin, messageController.message_delete_get);
router.post('/delete-message/:id', isSignedIn, isAdmin, messageController.message_delete_post)

module.exports = router;
