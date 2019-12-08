#!/usr/bin/env node

const fs = require('fs');

function execute(intcode, position, cbInput, cbOutput) {
    let instruction = intcode[position];
    let instructionString = instruction.toString().split('').reverse();

    let opcode = instruction % 100;
    let mode1 = instructionString[2] == '1';
    let mode2 = instructionString[3] == '1';
    let mode3 = instructionString[4] == '1';

    let a1, a2, result;

    switch (opcode) {
        case 99:
            return -1;
        case 1:
        case 2:
        case 7:
        case 8:
            a1 = intcode[position + 1];
            if (!mode1)
                a1 = intcode[a1];

            a2 = intcode[position + 2];
            if (!mode2)
                a2 = intcode[a2];

            result = 0;
            switch (opcode) {
                case 1:
                    result = a1 + a2
                    break;
                case 2:
                    result = a1 * a2;
                    break;
                case 7:
                    if (a1 < a2)
                        result = 1
                    break;
                case 8:
                    if (a1 == a2)
                        result = 1;
                    break;
            }

            intcode[intcode[position+3]] = result;
            position += 4;
            break;
        case 3:
        case 4:
            a1 = intcode[position + 1];
            if (mode1)
                a1 = intcode[a1];

            if (opcode == 3) {
                intcode[intcode[position+1]] = cbInput();

            }
            else if (opcode == 4){
                cbOutput(intcode[intcode[position+1]]);
            }

            position += 2;
            break;

        case 5:
            a1 = intcode[position + 1];
            if (!mode1)
                a1 = intcode[a1];

            a2 = intcode[position + 2];
            if (!mode2)
                a2 = intcode[a2];

            if (a1 != 0)
                position = a2;
            else
                position += 3;
            break;

        case 6:
            a1 = intcode[position + 1];
            if (!mode1)
                a1 = intcode[a1];

            a2 = intcode[position + 2];
            if (!mode2)
                a2 = intcode[a2];

            if (a1 == 0)
                position = a2;
            else
                position += 3;
            break;

        default:
            throw "Unknown opcode at position " + position + ": " + opcode;
    }

    return position;
}

function executeProgram(intcode, input, output) {
    let inputPointer = 0;
    let cbInput = () => input[inputPointer++];
    let cbOutput = value => output.push(value);

    let position = 0;
    while (position != -1) {
        position = execute(intcode, position, cbInput, cbOutput);
    }
    return intcode[0];
}

let contents = fs.readFileSync("adv05.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));


let output = [];
executeProgram(originalIntcode.slice(), [1], output);
console.log("Part One:", output.pop());

output = []
executeProgram(originalIntcode.slice(), [5], output);
console.log("Part Two:", output.pop());
