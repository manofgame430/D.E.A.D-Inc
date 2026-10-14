import { db } from "./prisma/db.ts";

async function resetDatabase() {
  console.log("Starting D.E.A.D. Inc. database reset...\n");

  try {
    console.log("Deleting existing data...");

    const reset = db.raw.sql`
      TRUNCATE TABLE
        "Encounter",
        "Visit",
        "Guest",
        "Monster",
        "Room"
      RESTART IDENTITY
      CASCADE
    `
      .affectedCount()
      .build();

    const result = await db.runtime().execute(reset);

    console.log(
      `Database reset complete. ${result.affectedRows} rows affected.`
    );
  } catch (error) {
    console.error("\nDatabase reset failed:");
    console.error(error);
    process.exitCode = 1;
  }
}

resetDatabase();