import fs from "fs";

const leapYear = process.argv.includes("--leapYear");

const months = [
  { name: "JAN", days: 31 },
  { name: "FEB", days: leapYear ? 29 : 28 },
  { name: "MAR", days: 31 },
  { name: "APR", days: 30 },
  { name: "MAY", days: 31 },
  { name: "JUN", days: 30 },
  { name: "JUL", days: 31 },
  { name: "AUG", days: 31 },
  { name: "SEP", days: 30 },
  { name: "OCT", days: 31 },
  { name: "NOV", days: 30 },
  { name: "DEC", days: 31 },
];

const validDates = [];
months.forEach((month) => {
  for (let day = 1; day <= month.days; day++) {
    validDates.push(`${month.name}${day}`);
  }
});

fs.writeFile(
  "./generated/validDates.json",
  JSON.stringify(validDates, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Saved dates to validDates.json");
  }
);
