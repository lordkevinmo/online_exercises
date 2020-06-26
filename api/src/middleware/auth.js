const jwt = require('jsonwebtoken');
const UserSession = require('../models/UserSession.model');

module.exports = (req, res, next) => {

    try {
        const token = req.cookies['token'] || req.query.token;
        const userIdCookie = req.cookies['userId'] || req.query.userId;

        if(req.query.userId && req.cookies['userId'] && req.query.userId!==req.cookies['userId'])
        {
            res.status(401).json({
                Error: "Invalid user ID"
            });
            return;
        }

        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;

        //console.log("Token: " + token + " userId: " + userIdCookie);
        if (userIdCookie !== userId) {
            res.status(401).json({
                Error: "Invalid user ID"
            });
        } else {

            UserSession.findOne({ userId: userId })
                .then((session) => {

                    if(session && session.token === token)
                        next();
                    else
                        res.status(401).json({
                            Error: "Invalid token or not stored!"
                        });
                })
                .catch((err) => {
                    res.status(401).json({
                        Error: err
                    });
                });

        }
    }
    catch (e) {
        res.status(401).json({
            Error: JSON.stringify(e)
        });
    }
};
