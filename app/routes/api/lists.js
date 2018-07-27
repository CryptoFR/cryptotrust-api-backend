/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express     = require("express"),

            conf        = require("../../modules/conf"),
            Validated   = require("../../models/validated"),

            router = express.Router();


    router.get("/", (req, res) => {
        const v = new Validated();

        return res.json(v.possibleTypes.map(vType => {
            return { "title": vType, "_link": `https://${conf.domain}/lists/${vType}`}
        }));
    });

    router.get("/:type", (req, res) => {

        const vTest = new Validated();

        if (vTest.possibleTypes.indexOf(req.params.type) === -1) {
            return res.status(400).send("Bad request");
        }

        return Validated.find({ type: req.params.type }).then(validHosts => {
            res.header({"Content-Type": "text/plain"});
            return res.send(validHosts.map(validHost => validHost.domain).join("\n"));
        });

    });

    module.exports = router;

})();