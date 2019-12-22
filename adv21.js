#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');

let contents = fs.readFileSync("adv21.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));
let out = [];

function runSpringdroid(originalIntcode, input) {
    let demage;
    new IntcodeComputer(originalIntcode, () => input.shift(), 
        (v) => {
            if (v > 127)
                demage = v;
            else
                process.stdout.write(String.fromCharCode(v))
        }
    ).start();
    return demage;
}

const input1 = 
`NOT T T
AND A T
AND B T
AND C T
NOT T T
NOT D J
NOT J J
AND T J
WALK\n`.split("").map(c => c.charCodeAt(0));

const input2 = 
`NOT T T
AND A T
AND B T
AND C T
NOT T T
NOT D J
NOT J J
AND T J
NOT E T
NOT T T
OR  H T
AND T J
RUN
`.split("").map(c => c.charCodeAt(0));


console.log("Part One:", runSpringdroid(originalIntcode, input1));
console.log("Part Two:", runSpringdroid(originalIntcode, input2));
