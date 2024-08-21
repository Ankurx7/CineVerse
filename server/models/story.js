const mongoose = require("mongoose");
const Comment = require("./comment");
const slugify = require("slugify");

const StorySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        unique: true,
        minlength: [4, "Title must be at least 4 characters long"]
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        minlength: [10, "Content must be at least 10 characters long"]
    },
    image: {
        type: String,
        default: "default.jpg"
    },
    readtime: {
        type: Number,
        default: 3
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: "Comment"
    }],
    commentCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

StorySchema.pre("save", function (next) {
    if (!this.isModified("title")) {
        return next();
    }
    this.slug = this.generateSlug();
    next();
});

StorySchema.pre("remove", async function (next) {
    await Comment.deleteMany({ story: this._id });
    next();
});

StorySchema.methods.generateSlug = function () {
    return slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@/?]/g,
        lower: true,
        strict: false,
        locale: 'tr',
        trim: true
    });
};

const Story = mongoose.model("Story", StorySchema);

module.exports = Story;
