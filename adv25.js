#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');


let contents = fs.readFileSync("adv25.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));
let input = [];

let size = 10;
let map = new Array(size).fill(null).map(a => new Array(size));
let y= size/2, x = size/2;

let computer;

let directions = [
    'north',
    'south',
    'east',
    'west',
]

/*
 * items required:
- dehydrated water
- bowl of rice
- candy cane
- dark matter
*/

process.stdin.on('data', function (data) {
    process.stdin.pause(); // stops after one line reads
    for (let i = 0; i < data.length; i++)
        input.push(data[i]);
    computer.start();
});

let lastMovement;

function inputCb() {
    return input.shift();
}

lastOutput = "";
const awaited = "Command?";
function outputCb(v) {
    let s = String.fromCharCode(v);

    process.stdout.write(s)

    if (v != 10)
        lastOutput += s;
    else {
        if (lastOutput.indexOf(awaited) != -1) {
            process.stdin.resume();
            computer.pause();
        } else {
            if (lastOutput[0] == '=') {
                map[y][x] = {name: lastOutput}
            }
        }
        lastOutput = "";
    }
}

computer = new IntcodeComputer(originalIntcode, inputCb, outputCb);
computer.start();
