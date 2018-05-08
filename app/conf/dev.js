module.exports = {
    domain: 'localhost:3000',
    api_url: 'http://api.domain.loc',
    app: {
        host: '0.0.0.0',
        port: 3000
    },
    mongodb: {
        hosts: [
            { host: 'localhost', port: 27017 }
        ],
        db: 'tests-db'
    },
    redis: {
        host: 'localhost',
        port: 6379,
        ttl: 260
    }
};