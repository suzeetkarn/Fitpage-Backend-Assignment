const redis = require("redis")
const logger = require("./logger")
const { redisURI } = require("./vars")

/**
 * Connect to mongo db
 *
 * @returns {object} Redis client
 * @public
 */
exports.createRedisClient = () => {
    const client = redis.createClient({ url: redisURI })

    client.on("error", (error) => {
        logger.error(`❌ Redis Error : ${error}`)
        process.exit(-1)
    })
    client.on("connect", () => logger.info(`✅ Connected to redis`))

    return client
}
