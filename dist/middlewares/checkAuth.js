"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = checkAuth;
function checkAuth(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken && accessToken === undefined) {
            res.status(401).send("Please authenticate");
        }
        else {
            next();
        }
    }
    catch (error) {
        console.log(error, 'checkAuth error');
        res.status(401).json({ message: "Unauthorized" });
    }
}
