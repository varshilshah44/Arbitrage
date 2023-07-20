require('dotenv').config();
import app from "./app";
import config from "config";
import { ConnectOptions, connect, set } from "mongoose";

const PORT = parseInt(config.get("PORT") || "3000");

const connectDB = async () => {
  try {
    set("debug", false);
    const mongoUri: string = config.get("DATABASE");

    const options: ConnectOptions = {
      autoIndex: true,
      autoCreate: true,
    };
    await connect(mongoUri, options);
    console.log("MongoDB Connected.....");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log("Listning to the port no:", PORT);
  // quizCron();
});