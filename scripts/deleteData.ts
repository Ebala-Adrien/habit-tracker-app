import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, authenticateUser } from "./firebaseConfig";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const userId = process.env.DEMO_USER_ID;

// Credentials for authentication
const email = process.env.DEMO_USER_EMAIL as string;
const password = process.env.DEMO_USER_PASSWORD as string;

// Function to delete all data for the demo user
export async function deleteAllData() {
  try {
    // Authenticate first
    await authenticateUser(email, password);

    // Delete all habits
    const habitsQuery = query(collection(db, "habit"), where("userId", "==", userId));
    const habitsSnapshot = await getDocs(habitsQuery);
    
    console.log(`Found ${habitsSnapshot.size} habits to delete`);
    
    for (const doc of habitsSnapshot.docs) {
      try {
        await deleteDoc(doc.ref);
        console.log("Successfully deleted habit:", doc.data().title);
      } catch (error) {
        console.error("Error deleting habit:", doc.data().title);
        console.error("Error details:", error);
        throw error;
      }
    }

    // Delete all tasks
    const tasksQuery = query(collection(db, "task"), where("userId", "==", userId));
    const tasksSnapshot = await getDocs(tasksQuery);
    
    console.log(`Found ${tasksSnapshot.size} tasks to delete`);
    
    for (const doc of tasksSnapshot.docs) {
      try {
        await deleteDoc(doc.ref);
        console.log("Successfully deleted task:", doc.data().title);
      } catch (error) {
        console.error("Error deleting task:", doc.data().title);
        console.error("Error details:", error);
        throw error;
      }
    }

    console.log("All data deleted successfully!");
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
} 