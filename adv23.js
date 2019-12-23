#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');

let contents = fs.readFileSync("adv23.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));

const totalComputers = 50;

let execute = true;
let solutionPart1, solutionPart2;

let nat;

let inputs = new Array(totalComputers);

let outPackets = new Array(totalComputers);

let computers = new Array(totalComputers);

isIdle = false;
let sameNatSent = 0;

for (let i = 0; i < totalComputers; i++) {
    inputs[i] = [i];
    outPackets[i] = [];

    let computerEmptyInputs;
    computers[i] = new IntcodeComputer(
        originalIntcode,
        () => {
            let v = inputs[i].shift();
            // console.log("INPUT", i, v);
            if (v == null) {
                if (computerEmptyInputs++ == 1) {
                    computerEmptyInputs = 0;
                    computers[i].pause();
                }
                return -1;
            }
            isIdle = false;
            console.log("RECEIVED", i, v);
            computerEmptyInputs = 0;
            return v;
        },
        v => {
            let op = outPackets[i];
            op.push(v);
            if (op.length >= 3) {
                console.log(op);
                let destination = op.shift();
                let x = op.shift();
                let y = op.shift();

                if (destination == 255) {
                    if (solutionPart1 == null)
                        solutionPart1 = y;

                    console.log("SENT NAT:", i, x, y);
                    nat = [x, y];
                    sameNatSent = 0;
                } else {
                    isIdle = false;
                    console.log("SENT:", i, destination, x, y);
                    inputs[destination].push(x, y);
                }
            }
        }
    );
}

while (execute) {
    let isNetworkIdle = true;
    for (let i = 0; i < totalComputers; i++) {
        isIdle = true;
        computers[i].start();
        isNetworkIdle = isNetworkIdle && isIdle;
    }
    if (isNetworkIdle) {
        console.log("Sending NAT:", nat);
        inputs[0].push(...nat);
        if (++sameNatSent == 2) {
            solutionPart2 = nat[1];
            break;
        }
    }
}

console.log("=====");
console.log("Part One:", solutionPart1);
console.log("Part Two:", solutionPart2);
