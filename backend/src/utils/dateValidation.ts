export function getTodayInBrazil(): Date {
  const now = new Date();
  const todayInBrazil = new Date(now.toLocaleString("en-US", { timeZone: "America/Fortaleza" }));
  todayInBrazil.setHours(0, 0, 0, 0);
  return todayInBrazil;
}

export function parseDateInBrazil(dateString: string): Date {
  return new Date(dateString + "T00:00:00-03:00");
}

export function parseDateTimeInBrazil(dateString: string, timeString: string): Date {
  return new Date(`${dateString}T${timeString}:00-03:00`);
}

export function getNowInBrazil(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Fortaleza" }));
}

export function isDateInFuture(dateString: string): boolean {
  const selectedDate = parseDateInBrazil(dateString);
  const today = getTodayInBrazil();
  return selectedDate >= today;
}

export function isDateTimeInFuture(dateString: string, timeString: string): boolean {
  const rideDateTime = parseDateTimeInBrazil(dateString, timeString);
  const now = getNowInBrazil();
  return rideDateTime > now;
}