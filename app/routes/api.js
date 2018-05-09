/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express = require("express"),
            parseDomain = require("parse-domain"),

            Validated   = require("../models/validated"),
            Report      = require("../models/report"),

            router = express.Router();

    router.get("/", (req, res) => {
        return res.send({hello: req.headers['x-forwarded-for'] || req.ip});
    });

    router.get("/status/:domain", (req, res) => {
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

    router.post("/report", (req, res) => {
        const nRep = new Report(req.body);
        nRep.data = new Date();
        nRep.ip = req.headers['x-forwarded-for'] || req.ip;
        nRep.save((err) => { if (err) console.error(err); });
        // Always send ACK :trollface:
        return res.send({success: true});
    });

    module.exports = router;

})();