#!/usr/bin/env node
"strict";

const fs = require('fs');

let contents = fs.readFileSync("adv16.txt", 'utf8').trim();
let signal = contents.split("").map(a => parseInt(a));

let pattern = [0, 1, 0, -1];

function calculateElement(signal, elementNumber) {
    let patternFactor = elementNumber;

    let sum = 0;

    let sl = signal.length;
    for (let k = patternFactor - 1; k < sl; k += patternFactor * 4) {
        for (let l = 0; l < patternFactor && k + l < sl; l ++) {
            sum += signal[k+l];
        }
    }

    for (let k = patternFactor * 3 - 1; k < sl; k += patternFactor * 4) {
        for (let l = 0; l < patternFactor && k + l < sl; l ++) {
            sum -= signal[k+l];
        }
    }

    return Math.abs(sum) % 10;
}

function calculateSignalPhase(signal, offset) {
    if (offset == null)
        offset = 0;

    let newSignal = new Array(signal.length);
    for (let i = offset; i < signal.length; i++) {
        newSignal[i] = calculateElement(signal, i + 1);
    }

    return newSignal;
}

function calculateNPhases(_signal, n, offset) {
    console.log(_signal.length, offset);
    let signal = _signal;
    for (let i = 1; i <= n; i++) {
        console.log(i + "/" + n);
        signal = calculateSignalPhase(signal, offset)
    }
    return signal;
}

console.log("Part One:", calculateNPhases(signal, 100).slice(0, 8).join(""));

let messageOffset = parseInt(signal.slice(0, 7).join(""));
const kRepeats = 10000;
let realSignal = [];
for (let i = 1; i <= kRepeats; i++)
    Array.prototype.push.apply(realSignal, signal);

console.log("Part Two:", calculateNPhases(realSignal, 100, messageOffset).slice(messageOffset, messageOffset + 8).join(""));
