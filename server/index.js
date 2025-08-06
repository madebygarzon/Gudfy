const express = require("express");
const cors = require("cors");
const { GracefulShutdownServer } = require("medusa-core-utils");
const loaders = require("@medusajs/medusa/dist/loaders/index").default;

require("./src/websocket");

(async () => {
  async function start() {
    const app = express();

    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map(origin => origin.trim())
      : ["http://localhost:8000"];

    app.use(cors({
      origin: allowedOrigins,
      credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const directory = process.cwd();

    try {
      const { container } = await loaders({
        directory,
        expressApp: app,
      });

      const configModule = container.resolve("configModule");
      const port =
        process.env.PORT ??
        process.env.BACKEND_PORT ??
        configModule.projectConfig.port ??
        9000;

      const server = GracefulShutdownServer.create(
        app.listen(port, (err) => {
          if (err) {
            return;
          }
          console.log(`Server is ready on port: ${port}`);
        })
      );

      const gracefulShutDown = async () => {
        try {
          if (container.hasRegistration("redisClient")) {
            const redis = container.resolve("redisClient");
            if (redis && typeof redis.quit === "function") {
              await redis.quit();  
            }
          }
        } catch (e) {
          console.error("Error closing Redis connection:", e);
        }

        server
          .shutdown()
          .then(() => {
            console.info("Gracefully stopping the server.");
            process.exit(0);
          })
          .catch((e) => {
            console.error("Error received when shutting down the server.", e);
            process.exit(1);
          });
      };

      process.on("SIGTERM", gracefulShutDown);
      process.on("SIGINT", gracefulShutDown);

    } catch (err) {
      console.error("Error starting server", err);
      process.exit(1);
    }
  }

  await start();
})();
