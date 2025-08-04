export function calculateEstimatedBudget(activities = [], baseCost = 0) {
  return activities.reduce((acc, activity) => acc + activity.price, baseCost);
}