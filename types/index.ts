import { UseFormReturn } from "react-hook-form";

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
    lastFrequencyUpdate: string, // ISO timestamp for last update of the frequency
    habitCompletions: string[], // ISO timestamp of all the times this habit has been completed
    timesDoneBeforeFreqUpdate: number, // How many times this habit had to be done before the last frequency update
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
    updatedAt: string; // ISO timestamp for last update
    completedAt?: string | null; // ISO timestamp for completion (null if not completed)
};

export type EditHabitOrTaskForm = UseFormReturn<
  {
    description?: string | undefined;
    title: string;
  },
  any,
  undefined
>;
