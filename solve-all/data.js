export const grid = [
  ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", null],
  ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC", null],
  ["1", "2", "3", "4", "5", "6", "7"],
  ["8", "9", "10", "11", "12", "13", "14"],
  ["15", "16", "17", "18", "19", "20", "21"],
  ["22", "23", "24", "25", "26", "27", "28"],
  ["29", "30", "31", null, null, null, null],
];

// run transformations.js to retrieve
export const transformations = {
  A: [
    [
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 2],
      [1, 1],
      [1, 0],
    ],
    [
      [2, 1],
      [1, 1],
      [0, 1],
      [2, 0],
      [1, 0],
      [0, 0],
    ],
  ],
  B: [
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 2],
      [2, 2],
    ],
    [
      [2, 2],
      [1, 2],
      [0, 2],
      [2, 1],
      [2, 0],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
      [1, 0],
      [0, 0],
    ],
  ],
  C: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [0, 0],
    ],
    [
      [1, 3],
      [1, 2],
      [1, 1],
      [1, 0],
      [0, 3],
    ],
    [
      [3, 0],
      [2, 0],
      [1, 0],
      [0, 0],
      [3, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [0, 0],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
    ],
    [
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 3],
    ],
    [
      [3, 1],
      [2, 1],
      [1, 1],
      [0, 1],
      [3, 0],
    ],
  ],
  D: [
    [
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [2, 2],
      [1, 2],
      [0, 2],
      [1, 1],
      [1, 0],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
      [1, 1],
      [0, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2],
    ],
  ],
  E: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 3],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
      [3, 0],
    ],
    [
      [1, 3],
      [1, 2],
      [1, 1],
      [0, 1],
      [0, 0],
    ],
    [
      [3, 0],
      [2, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [3, 1],
    ],
    [
      [0, 3],
      [0, 2],
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    [
      [3, 1],
      [2, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ],
  F: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 0],
    ],
    [
      [1, 3],
      [1, 2],
      [1, 1],
      [1, 0],
      [0, 2],
    ],
    [
      [3, 0],
      [2, 0],
      [1, 0],
      [0, 0],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [0, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [1, 1],
    ],
    [
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 2],
    ],
    [
      [3, 1],
      [2, 1],
      [1, 1],
      [0, 1],
      [2, 0],
    ],
  ],
  G: [
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 0],
    ],
    [
      [0, 2],
      [1, 2],
      [0, 1],
      [1, 1],
      [0, 0],
    ],
    [
      [2, 1],
      [2, 0],
      [1, 1],
      [1, 0],
      [0, 1],
    ],
    [
      [1, 0],
      [0, 0],
      [1, 1],
      [0, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [1, 0],
      [1, 1],
      [0, 0],
    ],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
    [
      [0, 1],
      [0, 0],
      [1, 1],
      [1, 0],
      [2, 1],
    ],
    [
      [1, 2],
      [0, 2],
      [1, 1],
      [0, 1],
      [1, 0],
    ],
  ],
  H: [
    [
      [2, 0],
      [2, 1],
      [1, 0],
      [0, 0],
      [0, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [
      [0, 1],
      [0, 0],
      [1, 1],
      [2, 1],
      [2, 0],
    ],
    [
      [1, 2],
      [0, 2],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ],
};

export const covered = [...Object.keys(transformations), "."];
