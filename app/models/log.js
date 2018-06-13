/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    "use strict";

    const mongoose        = require("mongoose");

    const LogSchema = new mongoose.Schema({
        domain: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    });

    module.exports = mongoose.model("log", LogSchema);

})();