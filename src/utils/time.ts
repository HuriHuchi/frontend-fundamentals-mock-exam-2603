export function getTimeSlots(start = 9, end = 20): string[] {
  const TIME_SLOTS: string[] = [];
  for (let h = start; h <= end; h++) {
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
    if (h < end) {
      TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
  return TIME_SLOTS;
}
