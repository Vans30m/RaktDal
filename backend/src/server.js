import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

async function startServer() {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`RaktDal API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start RaktDal API:", error);
    process.exit(1);
  }
}

startServer();
