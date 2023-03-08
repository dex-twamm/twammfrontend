export const formatToReadableTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString().substring(0, 17);
};
