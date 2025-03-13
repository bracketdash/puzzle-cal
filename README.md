# Puzzle Calendar Solver

This is a tailored solver for a daily puzzle calendar.

## Live UI

https://bracketdash.github.io/puzzle-cal/

- Click on a month to change the month
- Click on a day to change the day
- Flip through different solutions for the same day with the blue arrow buttons

## Command line usage

### Setup

```
npm install
```

### Find the first solution

Runs an algorithm that returns the first solution found for the target day.

```
node solve mar 12
```

### Look up the optimal solution

Looks up the solution for the target day in a previously generated "best path" through the year.

This "best path" requires the fewest average piece moves between days.

```
node lookup mar 12
```
