export function calculateBmr(gender: 'male' | 'female', weightInKg: number, heightInCm: number, age: number) {
   const genderShift = {
      male: 5,
      female: -161,
   };

   return 10 * weightInKg + 6.25 * heightInCm - 5 * age + genderShift[gender];
}
