/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express         = require("express"),
            async           = require("async"),

            Validated       = require("../models/validated"),
            Log             = require("../models/log"),

            router          = express.Router();

    router.get("/", (req, res) => {
        async.parallel([
            (cb) => { Log.count({}, cb); },
            (cb) => { Validated.count({}, cb); }
        ], (err, results) => {
            if (err) return res.status(500).send({error: "Couldn't retrieve stats!"});

            return res.send({
                hits: results[0],
                scams: results[1]
            });
        });
    });

    module.exports = router;

})();