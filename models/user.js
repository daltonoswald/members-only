const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 50 },
    last_name: { type: String, required: true, maxLength: 50 },
    username: { type: String, required: true, maxLength: 50 },
    password: { type: String, required: true, minLength: 8 },
    isMember: { type: Boolean, default: false, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
})

UserSchema.virtual('full_name').get(function () {
    return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model("User", UserSchema)