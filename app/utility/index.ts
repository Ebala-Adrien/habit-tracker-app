export function compareDates(date1: Date, date2: Date){
    return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
}

export function getWeekStartAndEnd(date: Date) {
    // Ensure input is a Date object
    const givenDate = new Date(date);
  
    // Find the day of the week (0 = Sunday, 1 = Monday, etc.)
    let dayOfWeek = givenDate.getDay();
    if (dayOfWeek === 0) {
      dayOfWeek = 7; // Treat Sunday as the 7th day for Monday-based week
    }
  
    // Calculate the start of the week (Monday)
    const startOfWeek = new Date(givenDate);
    startOfWeek.setDate(givenDate.getDate() - (dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0); // Set to 00:00:00
  
    // Calculate the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to get Sunday
    endOfWeek.setHours(23, 59, 59, 999); // Set to 23:59:59
    
    // Return the start and end of the week
    return {
        startOfWeek: startOfWeek.getTime(),
        endOfWeek: endOfWeek.getTime(),
    };
  }