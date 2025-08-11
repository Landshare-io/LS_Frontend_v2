export const formatNumber = (value : any) => {
  value = Number(value);
  return Number.isInteger(value) ? value : Number(value.toFixed(6));
}