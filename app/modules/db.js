const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = function(conf){
    let dbPath, first = true;
    for (let hostIndex in conf.mongodb.hosts) {
        if (first) {
            first = false;
            if (typeof conf.mongodb.auth != 'undefined') {
                dbPath = 'mongodb://' + conf.mongodb.auth.username + ':' + conf.mongodb.auth.password + '@' + conf.mongodb.hosts[hostIndex].host + ':' + conf.mongodb.hosts[hostIndex].port;
            } else {
                dbPath = 'mongodb://' + conf.mongodb.hosts[hostIndex].host + ':' + conf.mongodb.hosts[hostIndex].port;
            }
        } else {
            dbPath += ',' + conf.mongodb.hosts[hostIndex].host + ':' + conf.mongodb.hosts[hostIndex].port;
        }
    }
    dbPath += '/' + conf.mongodb.db;

    mongoose.connect(dbPath, {
        useMongoClient: true
    });
};