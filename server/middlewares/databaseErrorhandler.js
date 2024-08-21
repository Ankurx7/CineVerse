const asyncErrorWrapper = require("express-async-handler");
const Story = require("../models/story");

const checkStoryExist = asyncErrorWrapper(async (req, res, next) => {
    try {
        const { slug } = req.params;
        const story = await Story.findOne({ slug });

        if (!story) {
            return res.status(400).json({
                success: false,
                message: "There is no such story with that slug"
            });
        }

        req.story = story; // Optionally attach the story to the request object
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while checking the story"
        });
    }
});

const checkUserAndStoryExist = asyncErrorWrapper(async (req, res, next) => {
    try {
        const { slug } = req.params;
        const story = await Story.findOne({
            slug,
            author: req.user._id
        });

        if (!story) {
            return res.status(400).json({
                success: false,
                message: "There is no story with that slug associated with the user"
            });
        }

        req.story = story; // Optionally attach the story to the request object
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while checking the story"
        });
    }
});

module.exports = {
    checkStoryExist,
    checkUserAndStoryExist
};
