import express from "express";
import router from "./route";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB;

async function main() {
  await mongoose.connect(MONGO_URI as string, { dbName: MONGO_DB });
  const app = express();

  // global middlewares
  app.use(express.json());
  app.use(express.urlencoded({}));
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "ejs");

  app.use("/api", router);

  const port = process.env.PORT || 5000;

  app.listen(port, () => console.log(`Listening on port ${port}`));
}

main();
