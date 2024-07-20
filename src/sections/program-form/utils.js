export const getDayExercises = (activeDays, day) => {
  const index = activeDays.findIndex((item) => {
    return item.dayOfWeek === day;
  });

  if (index == -1) return [];
  return activeDays[index].exercises;
};
