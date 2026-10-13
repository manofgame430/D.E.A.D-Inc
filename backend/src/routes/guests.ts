import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const guests = await db.orm.public.Guest.all();

    res.json(guests);
  } catch (error) {
    console.error("Failed to get guests:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve guests"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      guestCode,
      ageGroup
    } = req.body;

    if (!guestCode) {
      return res.status(400).json({
        status: "error",
        message: "Guest code is required"
      });
    }

    const guest = await db.orm.public.Guest.create({
      guestCode,
      ageGroup
    });

    res.status(201).json(guest);
  } catch (error) {
    console.error("Failed to create guest:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create guest"
    });
  }
});

export default router;