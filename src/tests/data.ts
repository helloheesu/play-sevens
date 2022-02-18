export const getBeforeSlots = () => [
  null,
  null,
  {
    id: 2,
    value: 3,
    isMoveable: {
      left: true,
      right: true,
      up: false,
      down: true,
    },
  },
  null,
  null,
  null,
  {
    id: 6,
    value: 2,
    isMoveable: {
      left: true,
      right: true,
      up: false,
      down: true,
    },
  },
  null,
  null,
  {
    id: 9,
    value: 1,
    isMoveable: {
      left: true,
      right: true,
      up: true,
      down: true,
    },
  },
  null,
  {
    id: 11,
    value: 2,
    isMoveable: {
      left: true,
      right: false,
      up: true,
      down: true,
    },
  },
  {
    id: 12,
    value: 2,
    isMoveable: {
      left: false,
      right: true,
      up: true,
      down: false,
    },
  },
  null,
  {
    id: 14,
    value: 1,
    isMoveable: {
      left: true,
      right: false,
      up: true,
      down: false,
    },
  },
  {
    id: 15,
    value: 1,
    isMoveable: {
      left: true,
      right: false,
      up: true,
      down: false,
    },
  },
];

export const getMovedDownSlots = () => {
  const result = getBeforeSlots();
  result[13] = result[9];
  result[9] = null;
  result[10] = result[6];
  result[6] = result[2];
  result[2] = null;
  result[15]!.value = 3;
  result[11] = null;

  return result;
};

export const getMoveableUpdatedSlots = () => {
  const result = getMovedDownSlots();
  result[2] = {
    id: 1379,
    value: 2,
    isMoveable: {
      left: true,
      down: true,
      right: true,
      up: false,
    },
  };
  result[6]!.isMoveable = {
    left: true,
    down: true,
    right: true,
    up: false,
  };
  result[10]!.isMoveable = {
    left: true,
    down: true,
    right: true,
    up: false,
  };
  result[12]!.isMoveable = {
    left: false,
    down: false,
    right: true,
    up: true,
  };
  result[13]!.isMoveable = {
    left: true,
    down: false,
    right: false,
    up: true,
  };
  result[14]!.isMoveable = {
    left: true,
    down: false,
    right: false,
    up: true,
  };
  result[15]!.isMoveable = {
    left: true,
    down: false,
    right: false,
    up: true,
  };

  return result;
};
