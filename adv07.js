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

function executeProgram(intcode, input, output, startPosition) {
    let inputPointer = 0;
    let stop = false;
    let cbInput = () => {
        return input[inputPointer++];
    };
    let cbOutput = value => {output.push(value); stop = true};

    let position = startPosition;
    if (position == null)
        position = 0;

    while (position != -1 && !stop) {
        position = execute(intcode, position, cbInput, cbOutput);
    }
    return [intcode, position];
}

function executeAmplifiers(intcode, phrases) {
    let currentSignal = 0;
    for (let i in phrases) {
        let output = [];
        executeProgram(intcode.slice(), [phrases[i], currentSignal], output);

        currentSignal = parseInt(output.pop());
    }
    return currentSignal;
}

function executeAmplifiersFeedback(intcode, phrases) {
    let currentSignal = 0;
    let amplifiersState = new Array(5).fill(null);
    let output = new Array(phrases.length).fill(null).map(a => []);
    for (let i in phrases)
        amplifiersState[i] = [intcode.slice(), 0];
    
    // Init amplifiers
    for (let i in phrases) {
        amplifiersState[i] = executeProgram(amplifiersState[i][0], [phrases[i], currentSignal], output[i], amplifiersState[i][1]);
        currentSignal = (output[i][output[i].length - 1]);
    }

    do {
        for (let i in phrases) {
            amplifiersState[i] = executeProgram(amplifiersState[i][0], [currentSignal], output[i], amplifiersState[i][1]);

            currentSignal = (output[i][output[i].length - 1]);
        }
    } while (amplifiersState[amplifiersState.length - 1][1] != -1);
    return currentSignal;
}

function findCombinations(array) {
    if (array.length == 1)
        return array;

    let combinations = [];
    for (let i in array) {
        let newArray = array.slice();
        newArray.splice(i, 1);
        let childCombinations = findCombinations(newArray);
        for (let j in childCombinations)
            combinations.push([array[i]].concat(childCombinations[j]));
    }
    return combinations;
}


function findMaxSignal(intcode) {
    let phrases = findCombinations([0, 1, 2, 3, 4]);
    let maxSignal = 0;
    for (let i in phrases) {
        maxSignal = Math.max(maxSignal, parseInt(executeAmplifiers(intcode, phrases[i])));
    }

    return maxSignal;
}

function findMaxFeedbackSignal(intcode) {
    let phrases = findCombinations([5,6,7,8,9]);
    let maxSignal = 0;
    for (let i in phrases) {
        maxSignal = Math.max(maxSignal, parseInt(executeAmplifiersFeedback(intcode, phrases[i])));
    }

    return maxSignal;
}

let contents = fs.readFileSync("adv07.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));


console.log("Part One:", findMaxSignal(originalIntcode));
console.log("Part Two:", findMaxFeedbackSignal(originalIntcode));
