import { Days } from "../data";

// export type Habit = {
// id: string,
// user_id: string,
// title: string,
// description: string
// frequency: {
//     frequency: number,
//     repetition: "Weekly" | "Monthly";
// } | {
//     frequency: Days,
//     repetition: "Daily"
// },
// isRepetitive: true,
// occurrences: string[]
// created_at: Date
// modified_at: Date
// } |
// {
//     id: string,
//     title: string,
//     description: string
//     isRepetitive: false,
//     occurrences: string[]
//     created_at: Date
//     modified_at: Date
//     }
;

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DateType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31

export type HabitFrequency =
{
    type: 'weekly' | 'monthly'
    occurrences: number // How many times per week or per month this has to be repeated
    days?: never; // Explicitly exclude `days` in this case
}
| {
    type: 'weekly' | 'monthly',
    days: number[] // from 1 to 31 if monthly && from 0 to 6 if weekly
    occurrences?: never; // Explicitly exclude `days` in this case
} 
  
export type Habit = {
    id: string; // Unique identifier
    userId: string,
    title: string,
    description: string
    frequency: HabitFrequency; // Frequency configuration
    habitCompletions: string[], // ISO timestamp of all the times this habit has been completed
    createdAt: string; // ISO timestamp for creation
    updatedAt: string; // ISO timestamp for last update
};

export type Task = {
    id: string; // Unique identifier
    userId: string,
    title: string,
    description: string
    dueDate: string; // ISO date for when the task is due
    completed: boolean; // Completion status
    createdAt: string; // ISO timestamp for creation
    completedAt?: string | null; // ISO timestamp for completion (null if not completed)
};

export type HabitHistory = {
    id: string; // Unique identifier for the history record
    habitId: string; // Links to the Habit it belongs to
    changes: HabitFrequency; // Changes to the habit's frequency
    startDate: string; // When this version of the habit started
    endDate: string | null; // When this version of the habit ended (null if current)
    changedAt: string; // ISO timestamp for when the change was made
};
