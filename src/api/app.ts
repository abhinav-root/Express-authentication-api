import express from "express";
import router from "./authentication/route";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const app = express();

  // global middlewares
  app.use(express.json());

  app.use("/api", router);

  const port = process.env.PORT || 5000;

  app.listen(port, () => console.log(`Listening on port ${port}`));
}

main();
