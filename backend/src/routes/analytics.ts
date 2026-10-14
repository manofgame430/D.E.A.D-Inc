import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

/**
 * Rounds a number to two decimal places.
 */
function roundToTwo(value: number): number {
  return Number(value.toFixed(2));
}

/**
 * Calculates an average while ignoring null/undefined values.
 * Returns 0 when there are no values to average.
 */
function average(values: Array<number | null | undefined>): number {
  const validValues = values.filter(
    (value): value is number => value !== null && value !== undefined
  );

  if (validValues.length === 0) {
    return 0;
  }

  const total = validValues.reduce((sum, value) => sum + value, 0);
  return total / validValues.length;
}

/*
 * GET /api/analytics/overview
 *
 * Returns the main statistics for the D.E.A.D. Inc. dashboard.
 */
router.get("/overview", async (_req, res) => {
  try {
    const [guests, visits] = await Promise.all([
      db.orm.public.Guest.all(),
      db.orm.public.Visit.all()
    ]);

    const totalGuests = guests.length;
    const totalVisits = visits.length;

    const averageFear = average(visits.map((visit) => visit.fearRating));
    const averageVisitDuration = average(
      visits.map((visit) => visit.duration)
    );

    const completedVisits = visits.filter(
      (visit) => visit.completed === true
    ).length;

    const completionRate =
      totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;

    res.json({
      totalGuests,
      totalVisits,
      averageFear: roundToTwo(averageFear),
      averageVisitDuration: roundToTwo(averageVisitDuration),
      completionRate: roundToTwo(completionRate)
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
router.get("/monsters", async (_req, res) => {
  try {
    const [monsters, encounters] = await Promise.all([
      db.orm.public.Monster.all(),
      db.orm.public.Encounter.all()
    ]);

    const monsterAnalytics = monsters.map((monster) => {
      const monsterEncounters = encounters.filter(
        (encounter) => encounter.monsterId === monster.id
      );

      const averageFear = average(
        monsterEncounters.map((encounter) => encounter.fearRating)
      );

      return {
        id: monster.id,
        name: monster.name,
        encounters: monsterEncounters.length,
        averageFear: roundToTwo(averageFear)
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
router.get("/rooms", async (_req, res) => {
  try {
    const [rooms, encounters] = await Promise.all([
      db.orm.public.Room.all(),
      db.orm.public.Encounter.all()
    ]);

    const roomAnalytics = rooms.map((room) => {
      const roomEncounters = encounters.filter(
        (encounter) => encounter.roomId === room.id
      );

      const averageFear = average(
        roomEncounters.map((encounter) => encounter.fearRating)
      );

      return {
        id: room.id,
        name: room.name,
        encounters: roomEncounters.length,
        averageFear: roundToTwo(averageFear)
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
router.get("/attendance", async (_req, res) => {
  try {
    const visits = await db.orm.public.Visit.all();
    const attendanceByDate: Record<string, number> = {};

    for (const visit of visits) {
      const visitDate = new Date(String(visit.startTime));

      if (Number.isNaN(visitDate.getTime())) {
        continue;
      }

      const date = visitDate.toISOString().split("T")[0];
      attendanceByDate[date] = (attendanceByDate[date] ?? 0) + 1;
    }

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

/*
 * Mathematical calculations used:
 *
 * Total Guests: number of records in the Guest table.
 * Total Visits: number of records in the Visit table.
 * Average Fear: sum of recorded fear ratings / number of rated visits.
 * Average Visit Duration: sum of recorded durations / number of visits with a duration.
 * Completion Rate: completed visits / total visits * 100.
 * Monster Encounters: number of Encounter records with each monster.
 * Monster Average Fear: sum of a monster's fear ratings / number of rated encounters.
 * Room Encounters: number of Encounter records associated with each room.
 * Room Average Fear: sum of a room's fear ratings / number of rated encounters.
 * Attendance: visits grouped by calendar date and counted.
 */
