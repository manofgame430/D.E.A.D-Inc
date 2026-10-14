import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const visits = await db.orm.public.Visit.all();

    res.json(visits);
  } catch (error) {
    console.error("Failed to get visits:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve visits"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      guestId,
      startTime,
      endTime,
      duration,
      fearRating,
      completed
    } = req.body;

    if (!guestId || !startTime) {
      return res.status(400).json({
        status: "error",
        message: "Guest ID and start time are required"
      });
    }

    if (
      fearRating !== undefined &&
      fearRating !== null &&
      (fearRating < 0 || fearRating > 10)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Fear rating must be between 0 and 10"
      });
    }

    const visit = await db.orm.public.Visit.create({
      guestId,
      startTime,
      endTime,
      duration,
      fearRating,
      completed: completed ?? false
    });

    res.status(201).json(visit);
  } catch (error) {
    console.error("Failed to create visit:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create visit"
    });
  }
});

export default router;