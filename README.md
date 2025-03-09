# Daily Calendar Puzzle Solver

This is a tailored solver for a daily puzzle calendar.

## Setup

```
npm install
```

## Find the first solution

Runs an algorithm that returns the first solution found for the target day.

```
// node solve <month-3letter> <day>
// Example:
node solve mar 2
```

## Look up the optimal solution

Looks up the solution for the target day in a previously generated "best path" through the year.

This "best path" requires the fewest average piece moves between days.

```
// node lookup <month-3letter> <day>
// Example:
node lookup mar 2
```
