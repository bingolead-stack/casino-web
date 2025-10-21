export const wait = async (milliseconds: number) =>
  new Promise((resolve) => setTimeout(() => resolve(1), milliseconds));
