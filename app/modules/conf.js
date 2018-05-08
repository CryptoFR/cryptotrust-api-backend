/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    "use strict";

    const   dev     = require(process.cwd() + "/app/conf/dev.js"),   // Dev conf
            prod    = require(process.cwd() + "/app/conf/prod.js"),  // Prod conf
            ci      = require(process.cwd() + "/app/conf/ci.js");    // Continuous Integration conf

    let     conf;

    switch (process.env.NODE_ENV) {
        case 'development':
            conf = (process.env.CI == "true") ? ci : dev;
            conf.env = 'dev';
            break;
        case 'production':
            conf = prod;
            conf.env = 'prod';
            break;
        default:
            conf = prod;
            conf.env = 'prod';
    }

    module.exports = conf;
})();