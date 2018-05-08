/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   express = require('express'),
            router = express.Router();

    router.get('/', (req, res) => {
        return res.send({hello: "world"});
    });

    module.exports = router;

})();