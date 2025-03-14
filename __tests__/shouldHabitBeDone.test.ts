import { Habit } from "@/types";
import { shouldHabitBeDoneToday } from "@/utility/habitList";

const habitOne: Habit = {
    id: "12345678",
    userId: "12345678",
    title: "Medicament",
    description: "Il faut prendre mes médicaments 5 fois par semaine",
    frequency: {
        type: "weekly",
        days: [ 1, 2, 3, 4, 5 ]
    },
    lastFrequencyUpdate: "Wed, 25 Dec 2024 23:49:28 GMT",
    habitCompletions: [],
    timesDoneBeforeFreqUpdate: 4,
    createdAt: "Wed, 25 Dec 2024 23:49:28 GMT",
    updatedAt: "Wed, 25 Dec 2024 23:49:28 GMT",
} // Habit created in the middle of the current week / month

const habitTwo: Habit = {
    id: "12345678",
    userId: "12345678",
    title: "Medicament",
    description: "Il faut prendre mes médicaments 5 fois par semaine",
    frequency: {
        type: "weekly",
        occurrences: 5
    },
    lastFrequencyUpdate: "Wed, 25 Dec 2024 23:49:28 GMT",
    habitCompletions: [ "Thu, 26 Dec 2024 20:49:28 GMT", "Fri, 27 Dec 2024 20:49:28 GMT", "Sat, 28 Dec 2024 20:49:28 GMT"],
    timesDoneBeforeFreqUpdate: 4,
    createdAt: "Wed, 25 Dec 2024 23:49:28 GMT",
    updatedAt: "Wed, 25 Dec 2024 23:49:28 GMT",
} // Habit created in the middle of the current week / month

const habitThree: Habit = {
    id: "12345678",
    userId: "12345678",
    title: "Medicament",
    description: "Il faut prendre mes médicaments 5 fois par semaine",
    frequency: {
        type: "monthly",
        occurrences: 24
    },
    lastFrequencyUpdate: "Wed, 25 Dec 2024 23:49:28 GMT",
    habitCompletions: [ "Thu, 26 Dec 2024 20:49:28 GMT", "Fri, 27 Dec 2024 20:49:28 GMT", "Sat, 28 Dec 2024 20:49:28 GMT", "Sun, 29 Dec 2024 20:49:28 GMT"],
    timesDoneBeforeFreqUpdate: 4,
    createdAt: "Wed, 25 Dec 2024 23:49:28 GMT",
    updatedAt: "Wed, 25 Dec 2024 23:49:28 GMT",
} // Habit created in the middle of the current week / month

const startCurrentWeekOne = 1734908400000; // Sun, 22 Dec 2024 23:00:00 GMT (23 Dec in Paris)
const endCurrentWeekOne = 1735513199999; // Sun, 29 Dec 2024 22:59:59 GMT
const startCurrentMonthOne = 1733007600000; // Sat, 30 Nov 2024 23:00:00 GMT (1st Dec in Paris)
const endCurrentMonthOne = 1735685999999; // Tue, 31 Dec 2024 22:59:59 GMT
const currentDayOne = 1;
const currentDateOne = 25;

describe('', () => {
    test('Be done today. For a weekly habit on specific days.',  () => {       
        expect(shouldHabitBeDoneToday(habitOne, startCurrentWeekOne, endCurrentWeekOne, startCurrentMonthOne, endCurrentMonthOne, currentDayOne, currentDateOne)).toBeTruthy()
    })

    test('Be done today. For a weekly habit x times a week. This week already started when the habit was created.', () => {
        expect(shouldHabitBeDoneToday(habitTwo, startCurrentWeekOne, endCurrentWeekOne, startCurrentMonthOne, endCurrentMonthOne, currentDayOne, currentDateOne)).toBeFalsy()
    })

    test('Be done today. For a monthly habit x times a week. This month already started when the habit was created.', () => {
        expect(shouldHabitBeDoneToday(habitThree, startCurrentWeekOne, endCurrentWeekOne, startCurrentMonthOne, endCurrentMonthOne, currentDayOne, currentDateOne)).toBeFalsy()
    })
})