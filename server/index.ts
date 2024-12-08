import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/userRoutes";
import locationRoutes from "./routes/locationRoutes";
import { initSocket } from "../lib/socket";

const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/locations", locationRoutes);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
