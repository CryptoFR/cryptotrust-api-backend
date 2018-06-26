/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express     = require("express"),

            User        = require("../../models/user"),
            auth        = require("../../modules/auth"),

            router      = express.Router();


    router.get("/", auth.needAdmin, (req, res) => {

    });

    module.exports = router;

})();