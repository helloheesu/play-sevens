export const calculateScore = (value: number) => {
  if (value % 3 !== 0) {
    return 0;
  } else {
    const cardScore = Math.pow(3, Math.log2(value / 3) + 1);
    return cardScore;
  }
};
