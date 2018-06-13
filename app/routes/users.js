/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express     = require("express"),

            User        = require("../models/user"),
            conf        = require("../modules/conf"),

            router      = express.Router();


    // Register
    router.post("/", (req, res) => {
        const u = new User(req.body);
        u.setPassword(req.body.password);
        u.save((err) => {
            if (err) return res.status(500).send(err.message);

            return res.send({auth: true, token: u.jwt});
        });
    });

    router.get("/", (req, res) => {
        if (!req.query.api_key || req.query.api_key !== conf.api_key) {
            return res.status(401).send({ error: "Unauthorized." });
        }
        

    });

    module.exports = router;

})();