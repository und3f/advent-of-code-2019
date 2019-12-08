#!/usr/bin/env node

const fs = require('fs');

function calculateRequiredFuel(mass) {
    return Math.floor(mass / 3.0) - 2;
}

function calculateTotalRequiredFuel(mass) {
    let totalFuel = 0;
    let currentFuel = calculateRequiredFuel(mass);
    do {
        totalFuel += currentFuel;
        currentFuel = calculateRequiredFuel(currentFuel);
    } while (currentFuel >= 0);
    return totalFuel;
}

let contents = fs.readFileSync("adv01.txt", 'utf8').trim();
let fuelSum = contents.split("\n").map(line => calculateRequiredFuel(line)).reduce((accumulator, currentValue) => accumulator + currentValue);
console.log("Part One:", fuelSum);

let totalFuelSum = contents.split("\n").map(line => calculateTotalRequiredFuel(line)).reduce((accumulator, currentValue) => accumulator + currentValue);
console.log("Part Two:", totalFuelSum);
