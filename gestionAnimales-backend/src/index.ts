import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import express from "express";
import { supabase } from "./supabase-client.ts";

import authRoutes from "./routes/auth.ts";
import animalsRoutes from "./routes/animals.ts";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());  
app.use(cookieParser());
app.use(cors());


app.use("/auth", authRoutes);
app.use("/animals", animalsRoutes);

app.get("/", async (req, res) => {
  res.send("the API is working!");
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
});
