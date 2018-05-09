/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    'use strict';

    const   mongoose    = require("mongoose"),
            crypto      = require("crypto"),
            bcrypt      = require("bcrypt");

    const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
        },
        passwordHash: {
            type: String,
            required: true
        }
    });

    UserSchema.virtual("hash").get(() => {
        return crypto.createHash("md5").update(this.email).digest("hex");
    });

    UserSchema.methods.setPassword = function (password, cb) {
        bcrypt.hash(password, 10, (err, hash) => { // 10 = Salt Rounds
            this.passwordHash = hash;
            return cb();
        });
    };

    UserSchema.methods.validPassword = function (password, cb) {
        bcrypt.compare(password, this.passwordHash, function(err, res) {
            return cb(res);
        });
    };

    module.exports = mongoose.model('user', UserSchema);

})();