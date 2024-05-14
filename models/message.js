const mongoose = require("mongoose");
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, minLength: 1, maxLength: 25, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, minLength: 1, maxLength: 200, required: true },
    date: { type: Date, default: Date.now, required: true },
})

MessageSchema.virtual("date_formatted").get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", MessageSchema)