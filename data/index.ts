import * as Yup from "yup";

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

export const daysMapping = {
    0: {
        key: "S",
        order: 7,
        name: "Sunday"
    },
    1: {
        key: "M",
        order: 1,
        name: "Monday"
    },
    2: {
        key: "T",
        order: 2,
        name: "Tuesday"
    },
    3:  {
        key: "W",
        order: 3,
        name: "Wednesday"
    },
    4:  {
        key: "T",
        order: 4,
        name: "Thursday"
    },
    5: {
        key: "F",
        order: 5,
        name: "Friday"
    },
    6: {
        key: "S",
        order: 6,
        name:  "Saturday"
    },
} as const;

export const maxFrequencyWeek = 7;
export const maxFrequencyMonth = 30;

export const habitAndTaskFormInputsData = [
  {
    name: "title",
    placeholder: "Title",
  },
  {
    name: "description",
    placeholder: "Description",
  },
] as const;

export const editHabitOrTaskFormSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
  });

export const displayFrequencies = ["Day", "Week", "Month", "Overall"] as const;

export const filterArray = [
    {
      id: 1,
      name: "Habits",
      checked: true,
    },
    {
      id: 2,
      name: "Tasks",
      checked: true,
    },
  ];