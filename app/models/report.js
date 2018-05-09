/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    "use strict";

    const mongoose        = require("mongoose"),
        User            = require("./user");

    const ReportSchema = new mongoose.Schema({
        domain: {
            type: String,
            required: true
        },
        _user           : {
            type            : mongoose.Schema.ObjectId,
            index           : true,
            ref             : "User"
        },
        date: {
            type: Date,
            default: Date.now
        },
        ip: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: [ 'legit', 'suspicious', 'scam'],
            required: true
        },
        comment: {
            type: String,
            default: ""
        }
    });

    module.exports = mongoose.model("report", ReportSchema);

})();