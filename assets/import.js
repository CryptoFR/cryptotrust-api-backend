/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    "use strict";

    const
        request           = require("request"),

        conf              = require("../app/modules/conf"),
        dbInit            = require("../app/modules/db"),

        Validated   = require("../app/models/validated"),
        Report      = require("../app/models/report"),
        User        = require("../app/models/user"),

        dataUrl     = "https://raw.githubusercontent.com/CryptoFR/crypto-scams-fr/master/websites.txt";

    dbInit(conf);

    User.findOne({ email: "admin@cryptotrust.io" }).then((admin) => {
        const importDomainList = () => {
            request(dataUrl, (err, res, body) => {

                if (err) return console.error(err);

                body.split("\n").forEach((domain) => {
                   let validatedDomain = new Validated({
                       _user: admin,
                       domain: domain,
                       type: "scam"
                   });
                   validatedDomain.save((err) => {
                       if (err) console.error(err);

                       console.log(domain + " added.");
                   });
                });
            });
        };

        if (!admin) {
            admin = new User({
                email: "admin@cryptotrust.io"
            });
            admin.setPassword(Math.random().toString(36).substring(2), () => {
                admin.save((err) => {
                    if(err) return console.error(err);

                    admin.save().then(importDomainList);
                });
            });
        } else { importDomainList(); }

    }).catch((err) => { return console.error(err); })

})();