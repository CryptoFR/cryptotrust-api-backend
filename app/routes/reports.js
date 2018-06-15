/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express = require("express"),
            parseDomain = require("parse-domain"),

            Report      = require("../models/report"),

            conf        = require("../modules/conf"),

            router = express.Router();


    router.post("/", (req, res) => {
        const nRep = new Report(req.body);
        nRep.date = new Date();
        nRep.lang = nRep.lang.trim();
        nRep.ip = req.headers['x-forwarded-for'] || req.ip;
        let domainParts = parseDomain(req.body.domain);
        req.body.domain = `${domainParts.domain}.${domainParts.tld}`;
        nRep.save((err) => { if (err) console.error(err); });
        // Always send ACK :trollface:
        return res.send({success: true});
    });

    router.get("/", (req, res) => {
        if (!req.query.api_key || req.query.api_key !== conf.api_key) {
            return res.status(401).send({ error: "Unauthorized." });
        }

        Report.aggregate([
                {$group: {_id: {domain: "$domain", type: "$type", ip: "$ip"}, count: {$sum: 1}}},
                {$group: {_id: {domain: "$_id.domain", type: "$_id.type"}, count: {$sum: 1}, countAll: {$sum: "$count"}}}
            ]).then((results) => {
                let finalResults = {};

                for(let i in results) {
                    let r = results[i];
                    if (typeof finalResults[r._id.domain] === "undefined") finalResults[r._id.domain] = {};
                    finalResults[r._id.domain][r._id.type] = {
                        all: r.countAll,
                        unique: r.count
                    };
                }

                return res.send(finalResults);
        }).catch((err) => {
            console.error(err);
            return res.status(500).send(err);
        });

    });
    module.exports = router;

})();