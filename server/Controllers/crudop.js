const asyncErrorWrapper = require("express-async-handler");
const Story = require("../models/story");
const Comment = require("../models/comment");
const deleteImageFile = require("../Config/deleteFile");
const { searchHelper, paginateHelper } = require("../Config/queryHelp");

const addNewCommentToStory = asyncErrorWrapper(async (req, res) => {
    try {
        const { slug } = req.params;
        const { star, content } = req.body;

        const story = await Story.findOne({ slug: slug });
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found"
            });
        }

        const comment = await Comment.create({
            story: story._id,
            content: content,
            author: req.user.id,
            star: star
        });

        story.comments.push(comment._id);
        story.commentCount = story.comments.length;
        await story.save();

        return res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add comment",
            error: error.message
        });
    }
});

const getAllCommentByStory = asyncErrorWrapper(async (req, res) => {
    try {
        const { slug } = req.params;
        const story = await Story.findOne({ slug: slug });
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found"
            });
        }

        const commentList = await Comment.find({
            story: story._id
        }).populate({
            path: "author",
            select: "username photo"
        }).sort("-createdAt");

        return res.status(200).json({
            success: true,
            count: story.commentCount,
            data: commentList
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve comments",
            error: error.message
        });
    }
});

const commentLike = asyncErrorWrapper(async (req, res) => {
    try {
        const { activeUser } = req.body;
        const { comment_id } = req.params;

        const comment = await Comment.findById(comment_id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (!comment.likes.includes(activeUser._id)) {
            comment.likes.push(activeUser._id);
            comment.likeCount = comment.likes.length;
        } else {
            const index = comment.likes.indexOf(activeUser._id);
            comment.likes.splice(index, 1);
            comment.likeCount = comment.likes.length;
        }

        await comment.save();

        const likeStatus = comment.likes.includes(activeUser._id);

        return res.status(200).json({
            success: true,
            data: comment,
            likeStatus: likeStatus
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update comment like status",
            error: error.message
        });
    }
});

const getCommentLikeStatus = asyncErrorWrapper(async (req, res) => {
    try {
        const { activeUser } = req.body;
        const { comment_id } = req.params;

        const comment = await Comment.findById(comment_id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        const likeStatus = comment.likes.includes(activeUser._id);

        return res.status(200).json({
            success: true,
            likeStatus: likeStatus
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve comment like status",
            error: error.message
        });
    }
});
const addStory = asyncErrorWrapper(async (req, res) => {
    const { title, content } = req.body;
    const wordCount = content.trim().split(/\s+/).length;
    const readtime = Math.floor(wordCount / 200);

    try {
        const newStory = await Story.create({
            title,
            content,
            author: req.user._id,
            image: req.savedStoryImage,
            readtime
        });

        return res.status(200).json({
            success: true,
            message: "Story added successfully",
            data: newStory
        });
    } catch (error) {
        deleteImageFile(req);
        return res.status(500).json({
            success: false,
            message: "Failed to add story",
            error: error.message
        });
    }
});

const getAllStories = asyncErrorWrapper(async (req, res) => {
    try {
        let query = Story.find();
        query = searchHelper("title", query, req);

        const paginationResult = await paginateHelper(Story, query, req);
        query = paginationResult.query.sort("-likeCount -commentCount -createdAt");

        const stories = await query;

        return res.status(200).json({
            success: true,
            count: stories.length,
            data: stories,
            page: paginationResult.page,
            pages: paginationResult.pages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve stories",
            error: error.message
        });
    }
});

const detailStory = asyncErrorWrapper(async (req, res) => {
    const { slug } = req.params;
    const { activeUser } = req.body;

    try {
        const story = await Story.findOne({ slug }).populate("author likes");
        const storyLikeUserIds = story.likes.map(json => json.id);
        const likeStatus = storyLikeUserIds.includes(activeUser._id);

        return res.status(200).json({
            success: true,
            data: story,
            likeStatus: likeStatus
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve story details",
            error: error.message
        });
    }
});

const likeStory = asyncErrorWrapper(async (req, res) => {
    const { activeUser } = req.body;
    const { slug } = req.params;

    try {
        const story = await Story.findOne({ slug }).populate("author likes");
        const storyLikeUserIds = story.likes.map(json => json._id.toString());

        if (!storyLikeUserIds.includes(activeUser._id)) {
            story.likes.push(activeUser);
            story.likeCount = story.likes.length;
            await story.save();
        } else {
            const index = storyLikeUserIds.indexOf(activeUser._id);
            story.likes.splice(index, 1);
            story.likeCount = story.likes.length;
            await story.save();
        }

        return res.status(200).json({
            success: true,
            data: story
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to like/unlike story",
            error: error.message
        });
    }
});

const editStoryPage = asyncErrorWrapper(async (req, res) => {
    const { slug } = req.params;

    try {
        const story = await Story.findOne({ slug }).populate("author likes");

        return res.status(200).json({
            success: true,
            data: story
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve story for editing",
            error: error.message
        });
    }
});

const editStory = asyncErrorWrapper(async (req, res) => {
    const { slug } = req.params;
    const { title, content, image, previousImage } = req.body;

    try {
        const story = await Story.findOne({ slug });

        story.title = title;
        story.content = content;
        story.image = req.savedStoryImage || image;

        if (req.savedStoryImage) {
            deleteImageFile(req, previousImage);
        }

        await story.save();

        return res.status(200).json({
            success: true,
            data: story
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to edit story",
            error: error.message
        });
    }
});

const deleteStory = asyncErrorWrapper(async (req, res) => {
    const { slug } = req.params;

    try {
        const story = await Story.findOne({ slug });
        deleteImageFile(req, story.image);
        await story.remove();

        return res.status(200).json({
            success: true,
            message: "Story deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete story",
            error: error.message
        });
    }
});
module.exports = {
    addNewCommentToStory,
    getAllCommentByStory,
    commentLike,
    getCommentLikeStatus,
    addStory,
    getAllStories,
    detailStory,
    likeStory,
    editStoryPage,
    editStory,
    deleteStory
};