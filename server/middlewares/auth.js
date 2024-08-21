const User = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncErrorWrapper = require("express-async-handler");
const { isTokenIncluded, getAccessTokenFromHeader } = require("../Config/tokencheck");

const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {
    try {
        const { JWT_SECRET_KEY } = process.env;

        if (!isTokenIncluded(req)) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to access this route"
            });
        }

        const accessToken = getAccessTokenFromHeader(req);

        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET_KEY);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized to access this route"
                });
            }

            req.user = user;
            next();
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing your request"
        });
    }
});

module.exports = { getAccessToRoute };
