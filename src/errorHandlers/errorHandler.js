"usestrict";

const internalError = (error, req, res, next) => {
    console.log(error.name);
    // SyntaxError: This error occurs when there is a syntax issue with the token string itself. It indicates that the token format is not valid or does not adhere to the expected structure.
    // JsonWebTokenError This can include cases like an expired token, invalid signature, tampered token, or incorrect secret/key used for verification.
    if (
        error.name === "JsonWebTokenError" ||
        (error.name === "SyntaxError" && error.status === 401)
    ) {
        return res.status(401).send("Unauthorized, Invalid Token.");
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({
            message: "mongoose Validation Error",
            error: error.message,
        });
    }

    if (error.name === "Unauthorized") {
        return res
            .status(401)
            .send("Authentication required, Please sign in to proceed.");
    }
    if (error.name === "Unauthorized User") {
        return res.status(403).send("you do not have a permission");
    }
    // another way tahn error.name => error instanceof it is type
    if (error instanceof SyntaxError && error.status === 400) {
        // Log the specific error details
        console.error("JSON Syntax Error:", error.message);
        return res.status(400).json({ error: "Invalid JSON payload" });
    }
    res.status(500).json({
        message: "internal server error",
        error: error.message,
        route: req.originalUrl,
        stack: error.stack,
    });
};
module.exports = internalError;
