#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv09.txt", 'utf8').trim();

function execute(intcode, state, cbInput, cbOutput) {
    if (state.position == null)
        state.position = 0
    if (state.relativeBase == null)
        state.relativeBase = 0

    let position = state.position;

    let instruction = intcode[position];
    let instructionString = instruction.toString().split('').reverse();

    let opcode = instruction % 100;
    let mode1 = instructionString[2] == '1';
    let mode2 = instructionString[3] == '1';
    let mode3 = instructionString[4] == '1';

    let a1, a2, result;

    let getParameter = function(parameter) {
        let mode = instructionString[parameter + 1];
        let p = intcode[position + parameter];
        if (!mode || mode == 0)
            p = intcode[p] || 0
        else if (mode == 2) {
            p = intcode[state.relativeBase + p];
        }
        return p;
    }

    let setParameter = function(parameter, value) {
        let mode = instructionString[parameter + 1];
        let p = intcode[position + parameter];
        if (!mode || mode == 0)
            intcode[p] = value
        else if (mode == 2)
            intcode[state.relativeBase + p] = value;
    }

    switch (opcode) {
        case 99:
            return -1;
        case 1:
        case 2:
        case 7:
        case 8:
            a1 = getParameter(1);
            a2 = getParameter(2);

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

            setParameter(3, result);
            position += 4;
            break;
        case 3:
        case 4:

            if (opcode == 3) {
                let mode = instructionString[2];
                let p = intcode[position+1];
                if (mode == 2)
                    p = state.relativeBase;
                intcode[p] = cbInput();

            }
            else if (opcode == 4){
                a1 = getParameter(1)
                cbOutput(a1);
            }

            position += 2;
            break;

        case 5:
            a1 = getParameter(1);
            a2 = getParameter(2);

            if (a1 != 0)
                position = a2;
            else
                position += 3;
            break;

        case 6:
            a1 = getParameter(1);
            a2 = getParameter(2);

            if (a1 == 0)
                position = a2;
            else
                position += 3;
            break;

        case 9:
            a1 = getParameter(1);
            state.relativeBase += a1;
            position += 2;
            break;

        default:
            throw "Unknown opcode at position " + position + ": " + opcode;
    }

    state.position = position;
    return state.position;
}

function executeProgram(_intcode, input, output, startPosition) {
    let intcode = _intcode.slice();
    let inputPointer = 0;
    let stop = false;
    let cbInput = () => {
        return input[inputPointer++];
    };
    let cbOutput = value => {output.push(value);};

    let position;

    let state = {
        position: startPosition
    }

    while (position != -1 && !stop) {
        position = execute(intcode, state, cbInput, cbOutput);
    }
    return [intcode, position];
}

let originalIntcode = contents.split(",").map(a => parseInt(a));
let out = [];
(executeProgram(originalIntcode, [1], out));
console.log("Part One:", out);

out = [];
(executeProgram(originalIntcode, [2], out));
console.log("Part Two:", out);
