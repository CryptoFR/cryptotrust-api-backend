/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express         = require("express"),
            async           = require("async"),

            Validated       = require("../../models/validated"),
            Report          = require("../../models/report"),
            Log             = require("../../models/log"),

            router          = express.Router();

    router.get("/", (req, res) => {
        async.parallel([
            (cb) => { Log.count({}, cb); },
            (cb) => { Report.count({}, cb); },
            (cb) => { Validated.count({}, cb); }
        ], (err, results) => {
            if (err) return res.status(500).send({error: "Couldn't retrieve stats!"});

            return res.send({
                hits: results[0],
                reports: results[1],
                scams: results[2]
            });
        });
    });

    module.exports = router;

})();