import IORedis from "ioredis";

const bullRedis = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

export default bullRedis;