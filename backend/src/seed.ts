import { Temporal, toTemporalInstant } from "@js-temporal/polyfill";

(globalThis as any).Temporal = Temporal;

import "dotenv/config";
import { db } from "./prisma/db.ts";

const DAYS_TO_GENERATE = 30;

// ---------------------------------------------------------
// Helper functions
// ---------------------------------------------------------

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInstant(start: Date, end: Date): Temporal.Instant {
  const startMs = start.getTime();
  const endMs = end.getTime();

  const randomMs =
    startMs + Math.floor(Math.random() * (endMs - startMs));

  return Temporal.Instant.fromEpochMilliseconds(randomMs);
}

function toInstant(date: Date): Temporal.Instant {
  return Temporal.Instant.fromEpochMilliseconds(date.getTime());
}

/**
 * Generates a fear rating between 0 and 10.
 *
 * Math.max/min guarantees that even if the random
 * calculation changes later, the value can NEVER
 * leave the 0-10 range.
 */
function randomFearRating(min = 1, max = 10): number {
  const rating = randomInt(min, max);

  return Math.max(0, Math.min(10, rating));
}

/**
 * Generates a random date during the last 30 days.
 */
function randomDate(daysAgo: number): Date {
  const now = new Date();

  const date = new Date(now);

  date.setDate(now.getDate() - randomInt(0, daysAgo));

  date.setHours(
    randomInt(10, 21),
    randomInt(0, 59),
    randomInt(0, 59),
    0
  );

  return date;
}

/**
 * Adds a number of minutes to a Date.
 */
function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

// ---------------------------------------------------------
// Main seed function
// ---------------------------------------------------------

async function main() {
  console.log("Starting D.E.A.D. Inc. fake data generation...\n");

  // -------------------------------------------------------
  // Give command on how to clear existing fake data
  // -------------------------------------------------------

  console.log("Skipping data clearing — (to delete all data run: npm run reset).");

  // -------------------------------------------------------
  // Create Monsters
  // -------------------------------------------------------

  console.log("Creating monsters...");

  const monsterData = [
    {
      name: "The Butcher",
      email: "butcher@deadinc.com",
      password: "fake-password",
      species: "Demon",
      role: "Director of Provisions",
      active: true
    },
    {
      name: "Creepy Clown",
      email: "creepyclown@deadinc.com",
      password: "fake-password",
      species: "Clown",
      role: "Senior Laughter Engineer",
      active: true
    },
    {
      name: "Flesh Mass",
      email: "fleshmass@deadinc.com",
      password: "fake-password",
      species: "Aberration",
      role: "Containment Specialist",
      active: true
    },
    {
      name: "Haunted Doll",
      email: "haunteddoll@deadinc.com",
      password: "fake-password",
      species: "Possessed Doll",
      role: "Guest Relations Consultant",
      active: true
    },
    {
      name: "Haunted Mascot",
      email: "hauntedmascot@deadinc.com",
      password: "fake-password",
      species: "Mascot",
      role: "Brand Engagement Lead",
      active: true
    },
    {
      name: "Tall Stranger",
      email: "tallstranger@deadinc.com",
      password: "fake-password",
      species: "Unknown",
      role: "Director of Quiet Operations",
      active: true
    }
  ];

  const monsters = [];

  for (const monster of monsterData) {
    const created = await db.orm.public.Monster.create(monster);
    monsters.push(created);
  }

  console.log(`Created ${monsters.length} monsters.`);

  // -------------------------------------------------------
  // Create Rooms
  // -------------------------------------------------------

  console.log("Creating rooms...");

  const roomData = [
    {
      name: "The Butcher's Pantry",
      description: "A provision room overseen by the house's Director of Provisions.",
      difficulty: 9,
      active: true
    },
    {
      name: "The Funhouse",
      description: "A hall of mirrors managed by the Senior Laughter Engineer.",
      difficulty: 8,
      active: true
    },
    {
      name: "The Containment Room",
      description: "A sealed room for the mansion's most unusual resident.",
      difficulty: 10,
      active: true
    },
    {
      name: "The Doll Parlour",
      description: "A parlour filled with keepsakes and perfectly timed stares.",
      difficulty: 8,
      active: true
    },
    {
      name: "The Mascot Lounge",
      description: "A lounge for meet-and-greets, costume audits, and unscheduled parades.",
      difficulty: 7,
      active: true
    },
    {
      name: "The Long Gallery",
      description: "A silent gallery maintained by the Director of Quiet Operations.",
      difficulty: 9,
      active: true
    }
  ];

  const rooms = [];

  for (const room of roomData) {
    const created = await db.orm.public.Room.create(room);
    rooms.push(created);
  }

  console.log(`Created ${rooms.length} rooms.`);

  // -------------------------------------------------------
  // Create Guests
  // -------------------------------------------------------

  console.log("Creating guests...");

  const ageGroups = [
    "13-17",
    "18-24",
    "25-34",
    "35-44",
    "45+"
  ];

  const guests = [];

  // 250 guests over the month
  for (let i = 1; i <= 250; i++) {
    const guest = await db.orm.public.Guest.create({
      guestCode: `GUEST-${String(i).padStart(4, "0")}`,
      ageGroup: randomItem(ageGroups)
    });

    guests.push(guest);
  }

  console.log(`Created ${guests.length} guests.`);

  // -------------------------------------------------------
  // Create Visits + Encounters
  // -------------------------------------------------------

  console.log("Creating visits and encounters...");

  let totalVisits = 0;
  let totalEncounters = 0;

    for (const guest of guests) {
    /*
     * Each guest gets between 1 and 3 visits.
     * This makes the analytics more interesting.
     */
    const numberOfVisits = randomInt(1, 3);

    for (let v = 0; v < numberOfVisits; v++) {
      // Pick a random day within the last 30 days
      const startTime = randomDate(DAYS_TO_GENERATE);

      // Most visits last 10-25 minutes
      const duration = randomInt(10, 25);

      const endTime = addMinutes(startTime, duration);

      /*
       * Generate the overall visit fear rating.
       *
       * IMPORTANT:
       * randomFearRating() guarantees 0-10.
       */
      const fearRating = randomFearRating(2, 10);

      const completed = Math.random() > 0.08;

      const visit = await db.orm.public.Visit.create({
        guestId: guest.id,
        startTime: Temporal.Instant.fromEpochMilliseconds(
          startTime.getTime()
        ),
        endTime: Temporal.Instant.fromEpochMilliseconds(
          endTime.getTime()
        ),
        duration,
        fearRating,
        completed
      });

      totalVisits++;

      // ---------------------------------------------------
      // Create encounters for this visit
      // ---------------------------------------------------

      /*
       * A visit will encounter between 1 and 5 monsters.
       */
      const numberOfEncounters = randomInt(1, 5);

      for (let e = 0; e < numberOfEncounters; e++) {
        const monster = randomItem(monsters);
        const room = randomItem(rooms);

        const encounterDuration = randomInt(10, 90);

        /*
         * Individual encounters can have different fear
         * ratings from the overall visit.
         *
         * Still strictly limited to 0-10.
         */
        const encounterFear = randomFearRating(1, 10);

        await db.orm.public.Encounter.create({
          visitId: visit.id,
          monsterId: monster.id,
          roomId: room.id,
          fearRating: encounterFear,
          duration: encounterDuration
        });

        totalEncounters++;
      }
    }
  }

  // -------------------------------------------------------
  // Finished
  // -------------------------------------------------------

  console.log("\n-----------------------------------");
  console.log("D.E.A.D. Inc. seed complete!");
  console.log("-----------------------------------");
  console.log(`Monsters:   ${monsters.length}`);
  console.log(`Rooms:      ${rooms.length}`);
  console.log(`Guests:     ${guests.length}`);
  console.log(`Visits:     ${totalVisits}`);
  console.log(`Encounters: ${totalEncounters}`);
  console.log("-----------------------------------");
  console.log("Fear ratings are limited to 0-10.");
}

// ---------------------------------------------------------
// Run seed
// ---------------------------------------------------------

main()
  .catch((error) => {
    console.error("\nSeed failed:");
    console.error(error);
    process.exit(1);
  });