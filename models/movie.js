const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: String,
    rating: Number,
    watchedDate: Date,
    watched: {
        type: Boolean,
        default: false
    },
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Movie", movieSchema);