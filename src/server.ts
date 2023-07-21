require("dotenv").config();
import app from "./app";
import config from "config";
import { ConnectOptions, connect, set } from "mongoose";
import http from "http";
import initSocket from "./helper/socketHelper";
const { Server } = require("socket.io");

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.get("REACT_APP_URL")
  },
});
initSocket(io);

server.listen(PORT, () => {
  console.log("Listning to the port no:", PORT);
  // quizCron();
});
