/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    "use strict";

    const   mongoose        = require("mongoose"),
            User            = require("./user"),
            possibleTypes   = [ 'legit', 'suspicious', 'scam'];

    const ValidatedSchema = new mongoose.Schema({
        domain: {
            type: String,
            index: { unique: true },
            required: true
        },
        _user           : {
            type            : mongoose.Schema.ObjectId,
            index           : true,
            ref             : "User"
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        type: {
            type: String,
            enum: possibleTypes,
            required: true,
            default: 0
        },
        comment: {
            type: String,
            default: ""
        }
    });

    ValidatedSchema.virtual('possibleTypes').get(() => {
        return possibleTypes;
    });

    module.exports = mongoose.model("validated", ValidatedSchema);

})();