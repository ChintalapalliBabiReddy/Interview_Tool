
const { createCluster } = require("redis");

const redisClient = createCluster({
  rootNodes: [
    {
      url: `rediss://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 10000}`,
    },
  ],

  defaults: {
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,

    socket: {
      tls: true,
      servername: process.env.REDIS_HOST,
      connectTimeout: 10000,
      reconnectStrategy: (retries) =>
        Math.min(retries * 200, 3000),
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Cluster Error:", err.message);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  if (!redisClient.isReady) {
    throw new Error("Redis cluster is not ready");
  }

  console.log("Azure Redis Cluster Connected Successfully");
}

module.exports = redisClient;
module.exports.connectRedis = connectRedis;
