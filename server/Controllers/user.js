const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/user");
const Story = require("../models/story");
const { comparePassword, validateUserInput } = require("../Config/PassComp");

const profile = asyncErrorWrapper(async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve profile",
            error: error.message
        });
    }
});

const editProfile = asyncErrorWrapper(async (req, res) => {
    try {
        const { email, username } = req.body;

        const user = await User.findByIdAndUpdate(req.user.id, {
            email, username,
            photo: req.savedUserPhoto
        }, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
});

const changePassword = asyncErrorWrapper(async (req, res) => {
    try {
        const { newPassword, oldPassword } = req.body;

        if (!validateUserInput(newPassword, oldPassword)) {
            return res.status(400).json({
                success: false,
                message: "Please check your inputs"
            });
        }

        const user = await User.findById(req.user.id).select("+password");

        if (!comparePassword(oldPassword, user.password)) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            user: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message
        });
    }
});

const addStoryToReadList = asyncErrorWrapper(async (req, res) => {
    try {
        const { slug } = req.params;
        const { activeUser } = req.body;

        const story = await Story.findOne({ slug });
        const user = await User.findById(activeUser._id);

        if (!user.readList.includes(story.id)) {
            user.readList.push(story.id);
            user.readListLength = user.readList.length;
            await user.save();
        } else {
            const index = user.readList.indexOf(story.id);
            user.readList.splice(index, 1);
            user.readListLength = user.readList.length;
            await user.save();
        }

        const status = user.readList.includes(story.id);

        return res.status(200).json({
            success: true,
            story: story,
            user: user,
            status: status
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update read list",
            error: error.message
        });
    }
});

const readListPage = asyncErrorWrapper(async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const readList = [];

        for (let index = 0; index < user.readList.length; index++) {
            const story = await Story.findById(user.readList[index]).populate("author");
            readList.push(story);
        }

        return res.status(200).json({
            success: true,
            data: readList
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve read list",
            error: error.message
        });
    }
});

module.exports = {
    profile,
    editProfile,
    changePassword,
    addStoryToReadList,
    readListPage
};
