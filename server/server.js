import exp from "express";
import cors from "cors";
import { createServer } from "node:http";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const PORT = process.env.PORT || 5000;

const app = exp();

app.use(cors());
dotenv.config();

app.use("/", authRoutes);
app.use("/", quizRoutes);
app.use("/", dashboardRoutes);
app.use("/", adminRoutes);

const server = createServer(app);
server.listen(PORT, () => {
    console.log("server running");
});