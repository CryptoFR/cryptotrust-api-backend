module.exports = {
    domain: 'cryptotrust.trilogik.net',
    api_url: 'https://cryptotrust.trilogik.net',
    app: {
        host: '0.0.0.0',
        port: 3000
    },
    mongodb: {
        hosts: [
            { host: 'localhost', port: 27017 }
        ],
        db: 'cryptotrust'
    },
    redis: {
        host: 'localhost',
        port: 6379,
        ttl: 260
    }
};