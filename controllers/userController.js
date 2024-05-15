const User = require("../models/user");
const Message = require('../models/message');
var express = require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect Username" })
      };
      const match = await bcrypt.compare(password, user.password);
        if (!match) {
        return done(null, false, { message: "Incorrect password" })
      };
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, {_id: user._id});
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch(err) {
      done(err);
  };
});

exports.user_log_in_get = async (req, res, next) => {
  try {
    // const message = req.session.messages || [];
    // req.session.messages = [];

    res.render("log-in", {
      title: "Log in",
      // message: message[0],
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
}

exports.user_log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureMessage: true,
})


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
          // res.redirect("/log-in")
          res.redirect("/");
        }
        } catch (err) {
            console.log(err);
        }
      }
]

exports.user_join_club_get = (req, res, next) => {
  res.render("join-club", { title: "Join the Club", user: req.user });
}

exports.user_join_club_post = async (req, res, next) => {
  try {
    if (req.body.passcode === process.env.PASSCODE) {
      await User.findByIdAndUpdate(req.user.id, { isMember: true });
      console.log(req.user);
      res.redirect('/');
    } else {
      res.render('join-club', {
        title: "Join the Club",
        user: req.user,
        error: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
}