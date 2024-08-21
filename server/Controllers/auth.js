const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/user");
const { sendToken } = require("../Config/tokencheck");
const sendEmail = require("../Config/Emails");
const { validateUserInput, comparePassword } = require("../Config/PassComp");

const signup = asyncErrorWrapper(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await User.create({ username, email, password });
        sendToken(newUser, 201, res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to sign up",
            error: error.message
        });
    }
});

const login = asyncErrorWrapper(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!validateUserInput(email, password)) {
            return res.status(400).json({
                success: false,
                message: "Please check your inputs"
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!comparePassword(password, user.password)) {
            return res.status(404).json({
                success: false,
                message: "Please check your credentials"
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to log in",
            error: error.message
        });
    }
});

const getPrivateData = asyncErrorWrapper(async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "You got access to the private data in this route",
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve private data",
            error: error.message
        });
    }
});

const forgotpassword = asyncErrorWrapper(async (req, res) => {
    try {
        const { URI, EMAIL_USERNAME } = process.env;
        const resetEmail = req.body.email;

        const user = await User.findOne({ email: resetEmail });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "There is no user with that email"
            });
        }

        const resetPasswordToken = user.getResetPasswordTokenFromUser();
        await user.save();

        const resetPasswordUrl = `${URI}/resetpassword?resetPasswordToken=${resetPasswordToken}`;

        const emailTemplate = `
        <h3 style="color: red">Reset Your Password</h3>
        <p>This <a href=${resetPasswordUrl} target='_blank'>link</a> will expire in 1 hour</p>
        `;

        try {
            await sendEmail({
                from: EMAIL_USERNAME,
                to: resetEmail,
                subject: "✔ Reset Your Password ✔",
                html: emailTemplate
            });

            return res.status(200).json({
                success: true,
                message: "Email sent"
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({
                success: false,
                message: 'Email could not be sent',
                error: emailError.message
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to process forgot password request",
            error: error.message
        });
    }
});

const resetpassword = asyncErrorWrapper(async (req, res) => {
    try {
        const newPassword = req.body.newPassword || req.body.password;
        const { resetPasswordToken } = req.query;

        if (!resetPasswordToken) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid token"
            });
        }

        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid token or session expired"
            });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message
        });
    }
});

module.exports = {
    signup,
    login,
    resetpassword,
    forgotpassword,
    getPrivateData
};
