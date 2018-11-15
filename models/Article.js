var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new Schema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true,
        unique: true
    },

    summary: {
        type: String,
        required: true
    },

    saved: {
        type: Boolean,
        default: false
    },

    created: {
        type: Date,
        default: Date.now
    },
    
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;