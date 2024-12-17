import { Days } from "../data";

export type Habit = {
id: string,
user_id: string,
title: string,
description: string
frequency: {
    frequency: number,
    repetition: "Weekly" | "Monthly";
} | {
    frequency: Days,
    repetition: "Daily"
},
isRepetitive: true,
occurrences: string[]
} |
{
    id: string,
    title: string,
    description: string
    isRepetitive: false,
    occurrences: string[]
    }
;