export const monthObject: {
    [key: number]: string,
} = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
}

export type Days = {
    Monday: { key: "M"; repeat: boolean };
    Tuesday: { key: "T"; repeat: boolean };
    Wednesday: { key: "W"; repeat: boolean };
    Thursday: { key: "T"; repeat: boolean };
    Friday: { key: "F"; repeat: boolean };
    Saturday: { key: "S"; repeat: boolean };
    Sunday: { key: "S"; repeat: boolean };
};

export const daysMapping = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3:  "Wednesday",
    4:  "Thursday",
    5: "Friday",
    6: "Saturday",
} as const;

export const days: Days = {
    Monday: { key: "M", repeat: true },
    Tuesday: { key: "T", repeat: true },
    Wednesday: { key: "W", repeat: true },
    Thursday: { key: "T", repeat: true },
    Friday: { key: "F", repeat: true },
    Saturday: { key: "S", repeat: true },
    Sunday: { key: "S", repeat: true },
  };

  export const maxFrequencyWeek = 7;
  export const maxFrequencyMonth = 30;