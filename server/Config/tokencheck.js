const isTokenIncluded = (req) => {
    return (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    );
};

const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new Error("Invalid or missing authorization header.");
    }

    const access_token = authorization.split(" ")[1];

    if (!access_token) {
        throw new Error("Token is missing from the authorization header.");
    }

    return access_token;
};

const sendToken = (user, statusCode, res) => {
    try {
        const token = user.generateJwtFromUser();

        if (!token) {
            throw new Error("Failed to generate token.");
        }

        return res.status(statusCode).json({
            success: true,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while generating the token.",
        });
    }
};

module.exports = {
    sendToken,
    isTokenIncluded,
    getAccessTokenFromHeader,
};
