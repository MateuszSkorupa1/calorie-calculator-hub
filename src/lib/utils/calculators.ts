export type Gender =
  | 'male'
  | 'female'
  | 'non-binary'
  | 'other'
  | 'prefer-not-to-say';

export function bmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function tdee(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
  activityLevel: number,
  formula: 'male' | 'female' = 'male'
): number {
  // For non-binary/other, use formula param to select calculation
  let bmr =
    gender === 'male' || formula === 'male'
      ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
      : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;

  return bmr * activityLevel;
}

export function calorieGoal(
  tdeeCalories: number,
  goal: 'lose' | 'maintain' | 'gain'
): number {
  switch (goal) {
    case 'lose':
      return tdeeCalories - 500;
    case 'gain':
      return tdeeCalories + 500;
    default:
      return tdeeCalories;
  }
}
