import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

/*
 * GET /api/analytics/overview
 *
 * Returns the main statistics for the D.E.A.D. Inc. dashboard.
 */
router.get("/overview", async (req, res) => {
  try {
    const guests = await db.orm.public.Guest.all();
    const visits = await db.orm.public.Visit.all();

    const totalGuests = guests.length;
    const totalVisits = visits.length;

    // Only use visits that actually have a fear rating.
    const visitsWithFear = visits.filter(
      (visit) => visit.fearRating !== null && visit.fearRating !== undefined
    );

    const averageFear =
      visitsWithFear.length > 0
        ? visitsWithFear.reduce(
            (total, visit) => total + visit.fearRating,
            0
          ) / visitsWithFear.length
        : 0;

    // Only use visits that have a duration.
    const visitsWithDuration = visits.filter(
      (visit) => visit.duration !== null && visit.duration !== undefined
    );

    const averageVisitDuration =
      visitsWithDuration.length > 0
        ? visitsWithDuration.reduce(
            (total, visit) => total + visit.duration,
            0
          ) / visitsWithDuration.length
        : 0;

    const completedVisits = visits.filter(
      (visit) => visit.completed === true
    ).length;

    const completionRate =
      totalVisits > 0
        ? (completedVisits / totalVisits) * 100
        : 0;

    res.json({
      totalGuests,
      totalVisits,
      averageFear: Number(averageFear.toFixed(2)),
      averageVisitDuration: Number(
        averageVisitDuration.toFixed(2)
      ),
      completionRate: Number(completionRate.toFixed(2))
    });
  } catch (error) {
    console.error("Failed to get analytics overview:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve analytics overview"
    });
  }
});


/*
 * GET /api/analytics/monsters
 *
 * Returns encounter counts and average fear ratings for each monster.
 */
router.get("/monsters", async (req, res) => {
  try {
    const monsters = await db.orm.public.Monster.all();
    const encounters = await db.orm.public.Encounter.all();

    const monsterAnalytics = monsters.map((monster) => {
      const monsterEncounters = encounters.filter(
        (encounter) => encounter.monsterId === monster.id
      );

      const encountersWithFear = monsterEncounters.filter(
        (encounter) =>
          encounter.fearRating !== null &&
          encounter.fearRating !== undefined
      );

      const averageFear =
        encountersWithFear.length > 0
          ? encountersWithFear.reduce(
              (total, encounter) =>
                total + encounter.fearRating,
              0
            ) / encountersWithFear.length
          : 0;

      return {
        id: monster.id,
        name: monster.name,
        encounters: monsterEncounters.length,
        averageFear: Number(averageFear.toFixed(2))
      };
    });

    res.json(monsterAnalytics);
  } catch (error) {
    console.error("Failed to get monster analytics:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve monster analytics"
    });
  }
});


/*
 * GET /api/analytics/rooms
 *
 * Returns encounter counts and average fear ratings for each room.
 */
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await db.orm.public.Room.all();
    const encounters = await db.orm.public.Encounter.all();

    const roomAnalytics = rooms.map((room) => {
      const roomEncounters = encounters.filter(
        (encounter) => encounter.roomId === room.id
      );

      const encountersWithFear = roomEncounters.filter(
        (encounter) =>
          encounter.fearRating !== null &&
          encounter.fearRating !== undefined
      );

      const averageFear =
        encountersWithFear.length > 0
          ? encountersWithFear.reduce(
              (total, encounter) =>
                total + encounter.fearRating,
              0
            ) / encountersWithFear.length
          : 0;

      return {
        id: room.id,
        name: room.name,
        encounters: roomEncounters.length,
        averageFear: Number(averageFear.toFixed(2))
      };
    });

    res.json(roomAnalytics);
  } catch (error) {
    console.error("Failed to get room analytics:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve room analytics"
    });
  }
});


/*
 * GET /api/analytics/attendance
 *
 * Groups visits by date so the dashboard can display
 * attendance over time.
 */
router.get("/attendance", async (req, res) => {
  try {
    const visits = await db.orm.public.Visit.all();

    const attendanceByDate: Record<string, number> = {};

    visits.forEach((visit) => {
      const date = new Date(visit.startTime)
        .toISOString()
        .split("T")[0];

      if (attendanceByDate[date]) {
        attendanceByDate[date]++;
      } else {
        attendanceByDate[date] = 1;
      }
    });

    const attendance = Object.entries(attendanceByDate)
      .map(([date, visits]) => ({
        date,
        visits
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(attendance);
  } catch (error) {
    console.error("Failed to get attendance analytics:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve attendance analytics"
    });
  }
});


export default router;

// Total Guests: Counts the number of records in the Guests table.
// Total Visits: Counts the number of records in the Visits table.
// Average Fear: Adds all recorded fear ratings and divides by the number of rated visits.
// Average Visit Duration: Adds all recorded visit durations and divides by the number of visits with a duration.
// Completion Rate: Divides completed visits by total visits and multiplies by 100.
// Monster Encounters: Counts how many encounter records are associated with each monster.
// Monster Average Fear: Adds a monster's encounter fear ratings and divides by that monster's number of rated encounters.
// Room Encounters: Counts how many encounter records occurred in each room.
// Room Average Fear: Adds a room's encounter fear ratings and divides by that room's number of rated encounters.
// Attendance: Groups visits by date and counts how many visits occurred on each date.