import fs from "fs";

const solutions = JSON.parse(
  fs.readFileSync(new URL("../generated/allSolutions.json", import.meta.url))
);

const validDates = JSON.parse(
  fs.readFileSync(new URL("../generated/validDates.json", import.meta.url))
);

/*
for each valid date in the year (except dec 31) (allow flag to set whether it's a leap year):
    for each of this day's solutions:
        for each of the next day's solutions:
            create a difference score for the pair

resulting data should look like...

{
    'JAN1-JAN2': {
        '0-0': 6, // this means we are comparing JAN1's first solution to JAN2's first solution, and its difference score is 6 (made up)
        '0-1': 4,
    },
    'JAN2-JAN3': {
        ...
    },
    ...
}
*/

console.log(Object.keys(solutions).length); // 372
console.log(validDates.length); // 365
