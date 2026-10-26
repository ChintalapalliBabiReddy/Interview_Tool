
require("dotenv").config();

const { createCluster, createClient } = require("redis");

let redisClient;

// Local Redis: REDIS_URL=redis://localhost:6379
if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });
} else {
  // Azure Managed Redis Cluster
  redisClient = createCluster({
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
}

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  if (!redisClient.isReady) {
    throw new Error("Redis connection is not ready");
  }

  console.log("Redis connected successfully");
}

module.exports = redisClient;
module.exports.connectRedis = connectRedis;
