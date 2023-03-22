export const formatToReadableTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString().substring(0, 17);
};
