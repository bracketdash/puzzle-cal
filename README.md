# Daily Calendar Puzzle Solver

This is a tailored solver for a daily puzzle calendar.

This one:

![image](https://github.com/user-attachments/assets/4b1542f2-05dd-401b-b5cf-69e5ac4e2610)

## Find the first solution for a given day

1. `git clone`
2. `npm install`
3. `node solve <month> <day>`

Note: Target month should be the 3-letter abbreviation. Example: `node solve mar 2` for March 2.

## WIP: Find the optimal path through the year

Notes:
- Work in progress (currently updating `generators/bestPath.js`)
- The json produced by `generators/scoredPairs.js` is about 26MB, so it's in `.gitignore`
