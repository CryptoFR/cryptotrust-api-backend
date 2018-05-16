/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express         = require("express"),
            parseDomain     = require("parse-domain"),
            Redis           = require("redis"),

            Validated       = require("../models/validated"),

            conf            = require("../modules/conf"),

            redis           = Redis.createClient(),
            router          = express.Router();


    router.get("/:domain", (req, res) => {
        let domainParts = parseDomain(req.params.domain);
        const domain = `${domainParts.domain}.${domainParts.tld}`;

        redis.get(domain, (err, reply) => {

            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }

            if (reply) {
                return res.send(JSON.parse(reply));
            } else {
                return Validated.findOne({ domain: domain }).then((validatedReport) => {
                    let report;
                    if (validatedReport) {
                        report = {
                            domain: validatedReport.domain,
                            status: validatedReport.type,
                            last_update: validatedReport.date
                        };
                    } else {
                        report = { domain: domain,  status: "unknown" };
                    }
                    // Store in redis & send report
                    redis.set(domain, JSON.stringify(report), 'EX', conf.redis.expiration);
                    return res.send(report);
                }).catch((err) => {
                    console.error(err);
                    return res.status(500).send({ error: "Error recovering status for this domain" });
                });
            }

        });

    });

    module.exports = router;

})();