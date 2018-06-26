/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express     = require("express"),

            conf        = require("../modules/conf"),

            router      = express.Router();

    router.use((req, res, next) => {
        // Add CORS headers to allow external queries & Could include cookies
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    router.get("/", (req, res) => {
        return res.send({
            title: "CryptoTrust API by CryptoFR",
            synopsis: "Scam detection platform for the crypto world.",
            usage: {
                title: "Check if domain.com is legit",
                _link: `https://${conf.domain}/status/domain.com`
            },
            hello: req.headers['x-forwarded-for'] || req.ip
        });
    });

    router.use("/users", require("./api/users"));
    router.use("/reports", require("./api/reports"));
    router.use("/status", require("./api/status"));
    router.use("/stats", require("./api/stats"));

    router.use("/account", require("./api/account"));

    module.exports = router;

})();