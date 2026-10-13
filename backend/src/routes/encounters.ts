import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const encounters = await db.orm.public.Encounter.all();

    res.json(encounters);
  } catch (error) {
    console.error("Failed to get encounters:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve encounters"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      visitId,
      monsterId,
      roomId,
      fearRating,
      duration
    } = req.body;

    if (!visitId || !monsterId) {
      return res.status(400).json({
        status: "error",
        message: "Visit ID and monster ID are required"
      });
    }

    const encounter = await db.orm.public.Encounter.create({
      visitId,
      monsterId,
      roomId,
      fearRating,
      duration
    });

    res.status(201).json(encounter);
  } catch (error) {
    console.error("Failed to create encounter:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create encounter"
    });
  }
});

export default router;