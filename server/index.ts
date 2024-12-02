import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/userRoutes";
import locationRoutes from "./routes/locationRoutes";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/locations", locationRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
