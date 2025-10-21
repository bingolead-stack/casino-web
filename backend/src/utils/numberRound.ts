export const numberRound = (n: number, digit: number = 100) =>
  Math.round(n * digit) / digit;
