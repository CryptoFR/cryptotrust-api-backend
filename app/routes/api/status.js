/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express         = require("express"),
            parseDomain     = require("parse-domain"),
            Redis           = require("redis"),

            Validated       = require("../../models/validated"),
            Log             = require("../../models/log"),

            conf            = require("../../modules/conf"),

            redis           = Redis.createClient(conf.redis.port, conf.redis.host),
            router          = express.Router();

    if (typeof conf.redis.password !== "undefined") {
        redis.auth(conf.redis.password);
    }

    router.get("/:domain", (req, res) => {
        let domainParts = parseDomain(req.params.domain);

        if (domainParts === null || typeof domainParts.tld === "undefined") {
            return res.status(406).send({error: "Invalid domain"});
        }

        const domain = `${domainParts.domain}.${domainParts.tld}`;

        const log = new Log({domain: domain});
        log.save(); // Let the process end asynchronously in the background

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