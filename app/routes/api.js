/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express     = require("express"),

            conf        = require("../modules/conf"),

            router      = express.Router();

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

    router.use("/reports", require("./reports"));
    router.use("/status", require("./status"));

    module.exports = router;

})();