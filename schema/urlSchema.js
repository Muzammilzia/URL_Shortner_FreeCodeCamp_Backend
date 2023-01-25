const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = Schema({
    originalURL: {
        type: String,
        required: [true, "URL is required"]
    },
    shortURL: {
        type: String,
        required: [true, "URL is required"]
    },
})

module.exports = mongoose.model("urlSchema", urlSchema);