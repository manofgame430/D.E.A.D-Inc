import express from "express";
import cors from "cors";
import { db } from "./prisma/db.ts";
import monsterRoutes from "./routes/monsters.ts";
import roomRoutes from "./routes/rooms.ts";
import guestRoutes from "./routes/guests.ts";
import visitRoutes from "./routes/visits.ts";
import encounterRoutes from "./routes/encounters.ts";
import analyticsRoutes from "./routes/analytics.ts";

const app = express();

const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "D.E.A.D. Inc. API is running!"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const monsters = await db.orm.public.Monster.all();

    res.json({
      status: "ok",
      message: "Node → Prisma → PostgreSQL connection works!",
      monsterCount: monsters.length
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message
    });
  }
});

app.use("/api/monsters", monsterRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/encounters", encounterRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
  console.log(`D.E.A.D. Inc. API running on http://localhost:${PORT}`);
});