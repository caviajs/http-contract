export function convertToNumber(data: any): number | any {
  const casted = Number(data);
  return isNaN(casted) ? data : casted;
}