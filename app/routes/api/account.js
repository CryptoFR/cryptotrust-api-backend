/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express     = require("express"),

            User        = require("../../models/user"),
            conf        = require("../../modules/conf"),

            router      = express.Router();


    router.get("/", (req, res) => {
        res.send("<form method='post' action='/account/register'><input type='text' name='email'><input type='password' name='password'/><button type='submit'>OK</button></form>")
    });

    // Register
    router.post("/login", (req, res) => {
        User.findOne({
            email: req.body.login
        }, (err, user) => {
            if (err) throw err;
            if (!user) { return res.status(401).json({ message: "Authentication failed." }); }

            user.validPassword(req.body.password, (isValid) => {
                if (!isValid) { return res.status(401).json({ message: "Authentication failed." }); }
                return res.json({token: user.jwt});
            });
        });
    });

    router.post("/register", (req, res) => {
        if (typeof req.body.email === "undefined" || typeof req.body.password === "undefined") {
            return res.status(400).send("Bad request format");
        }
        const u = new User({email: req.body.email});
        return u.setPassword(req.body.password, () => {
            return u.save((err) => {
                if (err) return res.status(500).send(err.message);

                return res.json({auth: true, token: u.jwt});
            });
        });
    });

    router.get("/", (req, res) => {
        if (!req.query.api_key || req.query.api_key !== conf.api_key) {
            return res.status(401).json({ error: "Unauthorized." });
        }
    });

    module.exports = router;

})();