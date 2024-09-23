export const getDateStringFromTimestamp = (seconds: number) => {
  const MONTHs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const date = new Date(seconds);
  return `${MONTHs[date.getMonth()]}/${date.getDate()}/${date.getFullYear()}`;
}
