export const getTimeWithoutSecs = (time) => {
  return time.substring(0, 17);
};

export const formatToReadableTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString().substring(0, 17);
};
