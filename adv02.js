#!/usr/bin/env node

const fs = require('fs');

function execute(intcode, position) {
    let opcode = intcode[position];
    if (opcode == 99)
        return -1;
    if (opcode > 2 || opcode <= 0)
        throw "Unknown opcode at position " + position + ": " + opcode;

    let a1 = intcode[intcode[position + 1]], a2 = intcode[intcode[position + 2]];
    let result;
    if (opcode == 1)
        result = a1 + a2
    else
        result = a1 * a2;

    intcode[intcode[position+3]] = result;

    return position + 4;
}

function executeProgram(intcode) {
    let position = 0;
    while (position != -1) {
        position = execute(intcode, position);
    }
    return intcode[0];
}

function executeProgramNounVerb(originalIntcode, noun, verb) {
    let intcode = originalIntcode.slice()

    intcode[1] = noun;
    intcode[2] = verb;
    return executeProgram(intcode);
}

function findNounVerbPair(intcode, targetSum) {

    let currentSum = 0;
    let noun, verb;
    for (noun = 0; noun < intcode.length; noun++) {
        for (verb = 0; verb < intcode.length; verb++) {
            currentSum = executeProgramNounVerb(intcode, noun, verb);

            if (currentSum == targetSum)
                break;
        }
        if (currentSum == targetSum)
            break;
    }
    
    if (currentSum != targetSum)
        throw "Failed to find pair, noun " + noun + ", verb " + verb;

    return noun * 100 + verb;
}

let contents = fs.readFileSync("adv02.txt", 'utf8').trim();
//let intcode = "1,9,10,3,2,3,11,0,99,30,40,50".split(",").map(a => parseInt(a));
let originalIntcode = contents.split(",").map(a => parseInt(a));


console.log("Part One:", executeProgramNounVerb(originalIntcode, 12, 2));
console.log("Part Two:", findNounVerbPair(originalIntcode, 19690720));
