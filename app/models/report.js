/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    "use strict";

    const mongoose        = require("mongoose");

    const ReportSchema = new mongoose.Schema({
        domain: {
            type: String,
            required: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: [ 'legit', 'suspicious', 'scam'],
            required: true,
            default: 0
        },
        comment: {
            type: String,
            required: true
        }
    });

    const Report = mongoose.model("report", ReportSchema);
    module.exports = Report;

})();