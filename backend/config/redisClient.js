const { createClient } = require("redis");

const redisClient = createClient({
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 10000),
    tls: true,
    reconnectStrategy: (retries) =>
      Math.min(retries * 100, 3000),
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Azure Redis Connected Successfully");
  } catch (err) {
    console.error("Redis Connection Failed:", err.message);
  }
})();

module.exports = redisClient;
