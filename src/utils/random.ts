export const pickRandomValue = (values: number[]) => {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
};

// [REF] https://stackoverflow.com/a/12646864
// Randomize array in-place using Durstenfeld shuffle algorithm */
export const getShuffledArray = (originalArray: any[]) => {
  const newArray = [...originalArray];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }
  return newArray;
};
