import { deleteAllData } from "./deleteData";

// Execute the delete function
deleteAllData()
  .then(() => {
    console.log("Deletion completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deletion failed:", error);
    process.exit(1);
  }); 