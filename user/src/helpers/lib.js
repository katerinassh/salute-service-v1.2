function calculateDistance(x1, y1, x2, y2) {
  const rawDistance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  return Math.round(rawDistance * 100000);
}

function sortByInterestAndDistance(matchedUsers, maxInterestNumber) {
  let result = [];

  for (let currentNumber = maxInterestNumber; currentNumber > 0; currentNumber -= 1) {
    let selectionByInterestNumber = [];
    selectionByInterestNumber = matchedUsers.filter((user) => user.commonCount === currentNumber);

    selectionByInterestNumber.sort((a, b) => {
      if (a.distance > b.distance) return 1;
      if (a.distance < b.distance) return -1;
      return 0;
    });
    result = [...result, ...selectionByInterestNumber];
  }

  return result;
}

module.exports = { calculateDistance, sortByInterestAndDistance };
