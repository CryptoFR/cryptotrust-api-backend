/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express     = require("express"),
            parseDomain = require("parse-domain"),

            Report      = require("../../models/report"),

            conf        = require("../../modules/conf"),
            auth        = require("../../modules/auth"),

            router = express.Router();


    router.post("/", (req, res) => {
        for(let i in req.body) {
            req.body[i] = req.body[i].trim();
        }
        const nRep = new Report(req.body);
        nRep.date = new Date();
        nRep.ip = req.headers['x-forwarded-for'] || req.ip;
        let domainParts = parseDomain(req.body.domain);
        req.body.domain = `${domainParts.domain}.${domainParts.tld}`;
        nRep.save((err) => { if (err) console.error(err); });
        // Always send ACK :trollface:
        return res.send({success: true});
    });

    router.get("/", auth.needAdmin, (req, res) => {

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