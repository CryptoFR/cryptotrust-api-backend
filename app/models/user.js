/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    'use strict';

    const   mongoose    = require("mongoose"),
            crypto      = require("crypto"),
            jwt         = require("jsonwebtoken"),
            bcrypt      = require("bcrypt");

    const   conf        = require("../modules/conf");

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
        },
        flags: [ String ]
    });

    UserSchema.virtual("hash").get(function () {
        return crypto.createHash("md5").update(this.email).digest("hex");
    });

    UserSchema.virtual("jwt").get(function () {
        return jwt.sign({ email: this.email, id: this._id }, conf.jwt.secret, {
            expiresIn: conf.jwt.expiration
        });
    });

    UserSchema.methods.setPassword = function (password, cb) {
        return bcrypt.hash(password, 10, (err, hash) => { // 10 = Salt Rounds
            this.passwordHash = hash;
            return (cb && typeof cb === "function") ? cb() : true;
        });
    };

    UserSchema.methods.validPassword = (password, cb) => {
        bcrypt.compare(password, this.passwordHash, (err, res) => {
            return (cb && typeof cb === "function") ? cb(res) : res;
        });
    };

    module.exports = mongoose.model('user', UserSchema);

})();