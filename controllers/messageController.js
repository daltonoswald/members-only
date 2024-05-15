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
            user: req.author,
        });
    } catch (err) {
        console.log(err);
    }
    // console.log(req.user.username);
}