import { seedDatabase } from "./seedData";

// Execute the seeding function
seedDatabase()
  .then(() => {
    console.log("Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  }); 