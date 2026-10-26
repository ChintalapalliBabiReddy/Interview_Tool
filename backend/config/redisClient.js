
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
      connectTimeout: 10000,
      reconnectStrategy: (retries) =>
        Math.min(retries * 200, 3000),
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Cluster Error:", err.message);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Azure Redis Cluster Connected Successfully");
  } catch (err) {
    console.error("Redis Cluster Connection Failed:", err.message);
  }
})();

module.exports = redisClient;
