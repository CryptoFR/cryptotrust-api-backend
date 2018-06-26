/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const
        jsonwebtoken    = require("jsonwebtoken"),
        conf            = require("./conf"),

        User            = require("../models/user");

    module.exports = {

        /**
         * Middleware used to parse JWT token and place the detected user in request object
         * @param req
         * @param res
         * @param next
         */
        middleware: (req, res, next) => {
            if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                jsonwebtoken.verify(req.headers.authorization.split(' ')[1], conf.jwt.secret, (err, token) => {
                    if (err) {
                        req.user = undefined;
                        return next();
                    } else {
                        User.findOne({email: token.email}, (err, user) => {
                            if (err || !user) {
                                req.user = undefined;
                                return next();
                            }
                            req.user = user;
                            next();
                        });
                    }
                });
            } else {
                req.user = undefined;
                return next();
            }
        },

        /**
         * Use this when an API endpoint needs a login
         * @param req
         * @param res
         * @param next
         * @return {*|void}
         */
        needLogin: (req, res, next) => {
            if (!req.user) { return res.status(401).send({ error: "Unauthorized." }); }
            return next();
        },

        /**
         * Use this when an API endpoint needs an admin access
         * @param req
         * @param res
         * @param next
         * @return {*|void}
         */
        needAdmin: (req, res, next) => {
            if (!req.user || typeof req.user.flags === "undefined" || req.user.flags.indexOf("ADMIN") === -1) {
                return res.status(401).send({ error: "Unauthorized." });
            }
            return next();
        }

    }

})();