import express from "express";
import userRoutes from "./routes/userRoutes";
import regionRoutes from "./routes/regionRoutes";

const server = express();
server.use(express.json());

server.use(express.json());

server.use("/api/users", userRoutes);
server.use("/api/regions", regionRoutes);

export default server;
