module.exports = {
    domain: "localhost:3000",
    api_key: "devAPIkey",
    jwt: {
        secret: "fWTd3vs3crET+"
    },
    app: {
        host: "0.0.0.0",
        port: 3000
    },
    mongodb: {
        hosts: [
            { host: "localhost", port: 27017 }
        ],
        db: "tests-db"
    },
    redis: {
        host: "localhost",
        port: 6379,
        ttl: 260,
        expiration: 10 // 10sec in Dev Mode
    }
};