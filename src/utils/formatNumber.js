export const formatNumber = (x) => {
  if (x > 1_000_000_000) {
    return (x / 1_000_000_000).toFixed(1) + "B";
  } else if (x >= 1_000_000) {
    return (x / 1_000_000).toFixed(1) + "M";
  } else if (x >= 1_000) {
    return (x / 1_000).toFixed(1) + "K";
  }
  return x;
};
