export function getBGTime(): "morning" | "afternoon" | "evening" | "night" {
  const now = new Date();
  //Convert to indian time =             localtime to UTC                          +    5.5 hours
  const istTime = new Date((now.getTime() + now.getTimezoneOffset() * 60000) + (5.5 * 60 * 60 * 1000));

  const hour = istTime.getHours();
  
  if (hour >= 5 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 17) {
    return "afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "evening";
  } else {
    return "night";
  }
}