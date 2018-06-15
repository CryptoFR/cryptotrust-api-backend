/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(() => {

    "use strict";

    const   request         = require("request"),

            conf            = require("./app/modules/conf"),
            dbInit          = require("./app/modules/db"),

            Validated       = require("./app/models/validated");

    dbInit(conf);

    const listURI = "https://raw.githubusercontent.com/CryptoFR/crypto-scams-fr/master/websites.txt";
    const delay = 60 * 60;

    const refreshList = () => {
        console.log("New sync in progress...");
        request(listURI, (error, response, body) => {
            if (error) return console.error(error);

            if (response.statusCode !== 200) return console.error("Wrong response code!", response.statusCode);

            const domains = body.trim().split("\n");

            for (let domain of domains) {
                Validated.findOne({domain: domain}, (err, valid) => {
                    if (err) return console.err(err);

                    if (!valid) {

                        let tDom = new Validated({
                            type: "scam",
                            domain: domain
                        });

                        tDom.save((err) => {
                            if (err) return console.error(err);

                            console.log(`Domain ${domain} saved!`);
                        });
                    } else {
                        console.log(`Domain ${domain} already in database.`);
                    }
                });
            }
        });
    };

    setInterval(refreshList, delay);

})();