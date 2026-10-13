import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await db.orm.public.Room.all();

    res.json(rooms);
  } catch (error) {
    console.error("Failed to get rooms:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve rooms"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      difficulty,
      active
    } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Room name is required"
      });
    }

    const room = await db.orm.public.Room.create({
      name,
      description,
      difficulty,
      active: active ?? true
    });

    res.status(201).json(room);
  } catch (error) {
    console.error("Failed to create room:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create room"
    });
  }
});

export default router;