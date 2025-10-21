export const abbr = (str: string, n: number = 5) =>
  str.substring(0, n) + "..." + str.substring(str.length - n);
