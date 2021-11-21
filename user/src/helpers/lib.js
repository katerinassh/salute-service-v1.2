function calculateDistance(x1, y1, x2, y2) {
  const rawDistance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  return Math.round(rawDistance * 100000);
}

module.exports = { calculateDistance };
