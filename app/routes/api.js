/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express = require('express'),

            Validated   = require("../models/validated"),
            Report      = require("../models/report"),

            router = express.Router();

    router.get("/", (req, res) => {
        return res.send({hello: req.headers['x-forwarded-for'] || req.ip});
    });

    router.get("/status/:domain", (req, res) => {
        Validated.findOne({ domain: req.params.domain }).then((validatedReport) => {
            if (validatedReport) {
                return res.send({
                    last_update: validatedReport.date,
                    status: validatedReport.type
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
        nRep.save((err, res) => {
            return res.send(res);
        });
    });

    module.exports = router;

})();