#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');

let contents = fs.readFileSync("adv09.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));
let out;

new IntcodeComputer(originalIntcode, () => 1, (v) => out = v).start();
console.log("Part One:", out);

new IntcodeComputer(originalIntcode, () => 2, (v) => out = v).start();
console.log("Part Two:", out);
