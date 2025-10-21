export const numberFormat = (n: number) => {
  if (n < 10) {
    return n.toFixed(1);
  }

  if (n < 1000000) {
    return Math.round(n / 1000) + "k";
  }

  if (n < 1000000000) {
    return Math.round(n / 1000000) + "M";
  }

  return Math.round(n / 1000000000) + "B";
};
