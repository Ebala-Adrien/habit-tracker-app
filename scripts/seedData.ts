import { collection, addDoc } from "firebase/firestore";
import { db, authenticateUser } from "./firebaseConfig";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const userId = process.env.DEMO_USER_ID;
const now = new Date().toISOString();

// Helper function to create dates
const createDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Habits with different streaks
const habits = [
  {
    userId,
    title: "Morning Meditation",
    description: "15 minutes of mindfulness meditation",
    frequency: {
      type: "weekly",
      occurrences: 7,
      days: [1, 2, 3, 4, 5, 6, 0]
    },
    lastFrequencyUpdate: now,
    habitCompletions: [
      createDate(10), createDate(11), createDate(12), createDate(13),
      createDate(14), createDate(15), createDate(16), createDate(17),
      createDate(18), createDate(19), createDate(20), createDate(21),
      createDate(22), createDate(23), createDate(24), createDate(25),
    ],
    timesDoneBeforeFreqUpdate: 0,
    createdAt: createDate(30),
    updatedAt: now,
  },
  {
    userId,
    title: "Exercise",
    description: "30 minutes of physical activity",
    frequency: {
      type: "weekly",
      occurrences: 5,
      days: [1, 3, 5, 6, 0],
    },
    lastFrequencyUpdate: now,
    habitCompletions: [
      createDate(0), createDate(1), createDate(2), createDate(3),
      createDate(4), createDate(5), createDate(6), createDate(7),
      createDate(8), createDate(9), createDate(10),
    ],
    timesDoneBeforeFreqUpdate: 0,
    createdAt: createDate(30),
    updatedAt: now,
  },
  {
    userId,
    title: "Reading",
    description: "Read 20 pages of a book",
    frequency: {
      type: "weekly",
      occurrences: 7,
      days: [1, 2, 3, 4, 5, 6, 0] // Lunes a domingo
    },
    lastFrequencyUpdate: now,
    habitCompletions: [
      createDate(0), createDate(1), createDate(2), createDate(3),
      createDate(4), createDate(5), createDate(6), createDate(7),
      createDate(8), createDate(9), createDate(10), createDate(11),
      createDate(12), createDate(13), createDate(14), createDate(15),
      createDate(16), createDate(17), createDate(18), createDate(19),
      createDate(20), createDate(21), createDate(22), createDate(23),
      createDate(24), createDate(25), createDate(26), createDate(27),
      createDate(28), createDate(29), createDate(30),
    ],
    timesDoneBeforeFreqUpdate: 0,
    createdAt: createDate(30),
    updatedAt: now,
  },
  {
    userId,
    title: "Journaling",
    description: "Write in personal journal",
    frequency: {
      type: "weekly",
      occurrences: 7,
      days: [1, 2, 3, 4, 5, 6, 0]
    },
    lastFrequencyUpdate: now,
    habitCompletions: [
      createDate(0), createDate(1), createDate(2), createDate(3),
      createDate(4), createDate(5), createDate(6), createDate(7),
      createDate(8), createDate(9), createDate(10), createDate(11),
      createDate(12), createDate(13), createDate(14), createDate(15),
      createDate(16), createDate(17), createDate(18), createDate(19),
      createDate(20), createDate(21), createDate(22), createDate(23),
      createDate(24), createDate(25), createDate(26), createDate(27),
      createDate(28), createDate(29), createDate(30),
    ],
    timesDoneBeforeFreqUpdate: 0,
    createdAt: createDate(30),
    updatedAt: now,
  },
  {
    userId,
    title: "Drink Water",
    description: "Drink 8 glasses of water",
    frequency: {
      type: "weekly",
      occurrences: 7,
      days: [1, 2, 3, 4, 5, 6, 0]
    },
    lastFrequencyUpdate: now,
    habitCompletions: [
      createDate(0), createDate(1), createDate(2), createDate(3),
      createDate(4), createDate(5), createDate(6), createDate(7),
      createDate(8), createDate(9), createDate(10), createDate(11),
      createDate(12), createDate(13), createDate(14), createDate(15),
      createDate(16), createDate(17), createDate(18), createDate(19),
      createDate(20), createDate(21), createDate(22), createDate(23),
      createDate(24), createDate(25), createDate(26), createDate(27),
      createDate(28), createDate(29), createDate(30),
    ],
    timesDoneBeforeFreqUpdate: 0,
    createdAt: createDate(30),
    updatedAt: now,
  },
];

// Tasks with different due dates
const tasks = [
  {
    userId,
    title: "Complete Project Presentation",
    description: "Prepare and rehearse project presentation for next week",
    dueDate: createDate(7),
    completed: true,
    completedAt: now,
    createdAt: createDate(14),
    updatedAt: createDate(6),
  },
  {
    userId,
    title: "Review Meeting Notes",
    description: "Review and summarize yesterday's team meeting notes",
    dueDate: createDate(-5),
    completed: false,
    createdAt: createDate(3),
    updatedAt: now,
  },
  {
    userId,
    title: "Schedule Doctor Appointment",
    description: "Call and schedule annual check-up",
    dueDate: createDate(-2),
    completed: false,
    createdAt: createDate(3),
    updatedAt: now,
  }
];

// Credentials for authentication
const email = process.env.DEMO_USER_EMAIL as string;
const password = process.env.DEMO_USER_PASSWORD as string;

// Function to seed the database
export async function seedDatabase() {
  try {
    // Authenticate first
    await authenticateUser(email, password);

    // Add habits one by one
    for (const habit of habits) {
      try {
        console.log("Adding habit:", habit.title);
        await addDoc(collection(db, "habit"), habit);
        console.log("Successfully added habit:", habit.title);
      } catch (error) {
        console.error("Error adding habit:", habit.title);
        console.error("Error details:", error);
        console.error("Habit data:", JSON.stringify(habit, null, 2));
        throw error;
      }
    }

    // Add tasks one by one
    for (const task of tasks) {
      try {
        console.log("Adding task:", task.title);
        await addDoc(collection(db, "task"), task);
        console.log("Successfully added task:", task.title);
      } catch (error) {
        console.error("Error adding task:", task.title);
        console.error("Error details:", error);
        console.error("Task data:", JSON.stringify(task, null, 2));
        throw error;
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
} 