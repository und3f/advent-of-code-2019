#!/usr/bin/env node

const fs = require('fs');

let puzzleInput = "158126-624574";
let range = puzzleInput.split("-").map(v => parseInt(v));

let contents = fs.readFileSync("adv03.txt", 'utf8').trim();
let wiresDirections = contents.split("\n").map(a => a.split(","));

function isSatifying(password, isPartTwoCriteria) {
    let passwordNumber = parseInt(password);
    if (password.length != 6)
        return false;

    let previousSymbol = parseInt(password[0]);
    let doubles = []
    for (let i = 1; i < password.length; i++) {
        let currentSymbol = parseInt(password[i]);
        if (currentSymbol < previousSymbol)
            return false;
        else if (currentSymbol == previousSymbol) {
            doubles.push(currentSymbol);
        }
        previousSymbol = currentSymbol;
    }

    if (!isPartTwoCriteria)
        return doubles.length > 0;

    let doublesOccurance = {};
    for (let i in doubles) {
        let symbol = doubles[i];
        if (doublesOccurance[symbol] == undefined)
            doublesOccurance[symbol] = 1
        else
            doublesOccurance[symbol] ++;
    }

    for (let k in doublesOccurance) {
        if (doublesOccurance[k] == 1)
            return true;
    }
    return false;
}

let passwordMeetsCriteria = 0;
let passwordMeetsCriteria2 = 0
for (let i = range[0]; i <= range[1]; i++) {
    if (isSatifying(i.toString())) {
        passwordMeetsCriteria++;
        if (isSatifying(i.toString(), true)) {
            passwordMeetsCriteria2++;
        } else {
            // console.log("Ignoring", i);
        }
    }
}

console.log("Part One:", passwordMeetsCriteria);
console.log("Part Two:", passwordMeetsCriteria2);
