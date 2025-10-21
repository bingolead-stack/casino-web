export const stringToColor = (str: string) => {
  let hash = 0;
  if (str.length === 0) return "#000000";
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    color += ("00" + Math.round(value * 0.6).toString(16)).substr(-2);
  }
  return color;
};
