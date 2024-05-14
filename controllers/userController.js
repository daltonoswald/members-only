const User = require("../models/user");
const Message = require('../models/message');
var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

exports.user_create_get = (req, res, next) => {
  res.render("sign-up", { title: "Sign up", user: req.user });
}
exports.user_create_post = [
    body("first_name", "First Name must not be empty.")
      .trim()
      .isLength({ min: 1, max: 50 })
      .escape(),
    body("last_name", "Last Name must not be empty.")
      .trim()
      .isLength({ min: 1, max: 50 })
      .escape(),
    body("username", "Username must not be empty.")
      .trim()
      .isLength({ min: 1, max: 50 })
      .escape(),
    body("password", "Password must contain 8 characters.")
      .trim()
      .isLength({ min: 8 })
      .escape(),
    body("confirm_password", "The passwords do not match.")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          return false
        }
        return true;
      }),

      async(req, res, next) => {
        try {
        const errors = validationResult(req);

        const user = new User({
          title: req.body.title,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: await bcrypt.hash(req.body.password, 10)
        });

        if (!errors.isEmpty()) {
          res.render("sign-up", {
            title: "Sign up",
            userSignedUp: user,
            errors: errors.array(),
          });
          return;
        } else {
          // No Errors, check for duplicate usernames,
          const usernameTaken = await User.findOne({
            username: req.body.username,
          }).exec();
          if (usernameTaken) {
            res.render('sign-up', {
              title: "Sign up",
              userSignedUp: user,
              errors: [{ msg: "The Username is already in use."}],
            })
          }
          await user.save();
          // res.redirect("/sign-in")
          res.redirect("/");
        }
        } catch (err) {
            console.log(err);
        }
      }
]