const Message = require('../models/message');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.index = async function (req, res, next) {
    try {
        const allMessages = await Message.find({})
            .sort({ date: -1 })
            .populate('author')
            .exec();
        res.render('index', {
            title: "Homepage",
            messages: allMessages,
            user: req.user,
        });
    } catch (err) {
        console.log(err);
    }
    // console.log(req.user.username);
}

exports.new_message_get = (req, res, next) => {
    res.render('new-message', { title: "New Message", user: req.user });
}

exports.new_message_post = [
    body("title", "The title must be between 1 and 25 characters.")
        .trim()
        .isLength({ min: 1, max: 25 })
        .escape(),
    body("text", "The message must be between 1 and 200 characters.")
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            const post = new Message({
                title: req.body.title,
                text: req.body.text,
                author: req.user._id,
            });

            if (!errors.isEmpty()) {
                res.render("message", {
                    title: "Create a message",
                    user: req.user,
                    text: text,
                    errors: errors.array(),
                });
                return;
            } else {
                await post.save();
                res.redirect("/");
            }
        } catch (err) {
            console.log(err);
        }
    }
]

exports.message_delete_get = async (req, res, next) => {
    const message = await Message.findById(req.params.id).populate('author').populate('title').populate('text').exec();
    res.render('delete-message', {
        title: "Delete Message",
        user: req.user,
        message: message,
        userMessageId: req.params.id,
    })
}

exports.message_delete_post = async (req, res, next) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
}