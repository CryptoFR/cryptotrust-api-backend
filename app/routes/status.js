/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express = require("express"),
            parseDomain = require("parse-domain"),

            Validated   = require("../models/validated"),

            router = express.Router();


    router.get("/:domain", (req, res) => {
        let domainParts = parseDomain(req.params.domain);
        const domain = `${domainParts.domain}.${domainParts.tld}`;

        Validated.findOne({ domain: domain }).then((validatedReport) => {
            if (validatedReport) {
                return res.send({
                    domain: validatedReport.domain,
                    status: validatedReport.type,
                    last_update: validatedReport.date
                });
            } else {
                return res.send({
                    status: "unknown"
                });
            }
        }).catch((err) => {
            console.error(err);
            return res.status(500).send({ error: "Error recovering status for this domain" });
        });
    });

    module.exports = router;

})();