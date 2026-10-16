import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const monsters = await db.orm.public.Monster.all();

    res.json(monsters);
  } catch (error) {
    console.error("Failed to get monsters:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve monsters"
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, password, species, role, active } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name and password are required"
      });
    }

    const monster = await db.orm.public.Monster.create({
      name,
      email: `monster-${Date.now()}-${Math.random().toString(36).slice(2)}@deadinc.local`,
      password,
      species,
      role,
      active: active ?? true
    });

    res.status(201).json(monster);
  } catch (error) {
    console.error("Failed to create monster:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create monster"
    });
  }
});


export default router;