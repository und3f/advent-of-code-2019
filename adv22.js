#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv22.txt", 'utf8').trim();
let instructionStrings = contents.split("\n");

function generateDeck(size) {
    console.log(size);
    let deck = new Array(size);
    for (let i = 0; i < size; i++)
        deck[i] = i;
    return deck;
}

function dealIntoNewStack(deck) {
    return deck.reverse();
}

function dealIntoNewStackTraceBack(a, b, deckSize) {
    return [-a, - b - 1];
}

function cutN(deck, n) {
    if (n > 0)
        return deck.slice(n).concat(deck.slice(0, n));
    return deck.slice(n).concat(deck.slice(0, n));
}

function cutNTraceBack(a, b, deckSize, n) {
    return [a, b - n];
}

function dealWithIncrement(deck, n) {
    let length = deck.length;
    let newDeck = new Array(length);
    let i = 0;
    while (deck.length > 0) {
        let v = deck.shift();
        newDeck[i] = v;
        i = (i + n) % length;
        if (deck.length == 0)
            break;

        for (; newDeck[i] != null; i = (i + 1) % length) {}
    }

    return newDeck;
}

function dealWithIncrementTraceBack(a, b, deckSize, n) {
    return [a * n, b * n]; 
}


let instructionFunctions = [
    [new RegExp("deal into new stack"), dealIntoNewStack, dealIntoNewStackTraceBack],
    [new RegExp("cut (-?\\d+)"), cutN, cutNTraceBack],
    [new RegExp("deal with increment (\\d+)"), dealWithIncrement, dealWithIncrementTraceBack]
];

let instructions = instructionStrings.map(s => {
    for (let j = 0; j < instructionFunctions.length; j++) {
        let match = s.match(instructionFunctions[j][0])
        if (match == null)
            continue;

        let argument = parseInt(match[1]);
        return [argument].concat(instructionFunctions[j].slice(1));
    }
});

function shuffle(totalCards, times) {
    let deck = generateDeck(totalCards);
    for (let time = 0; time < (times || 1); time++) {
        for (let i = 0; i < instructions.length; i++) {
            let instruction = instructions[i];
            deck = instruction[1](deck, instruction[0]);
        }
    }
    return deck;
}

function normalize(coeficients, n) {
    for (let i = 0; i < coeficients.length; i++) {
        let a = coeficients[i];
        while (a < 0)
            a += n;
        coeficients[i] = a % n;
    }
    return coeficients;
}

function combine(c1, c2, n) {
    return [(c1[0] * c2[0]) % n, (c1[1] * c2[0] + c2[1]) % n];
}

function traceBack(cardN, totalCards, times) {
    let originalCoeficients = [1, 0];

    for (let i = 0; i < instructions.length; i++) {
        let instruction = instructions[i];
        //console.log(instruction);
        originalCoeficients = instruction[2](originalCoeficients[0], originalCoeficients[1], totalCards, instruction[0])
        // console.log(originalCoeficients);
        normalize(originalCoeficients, totalCards);
    }

    let coeficients = [...originalCoeficients];
    let resultCoeficients = [1, 0];

    let timesBinary = times.toString(2);
    for (let i = 0; i < timesBinary.length; i++) {
        if (timesBinary[timesBinary.length - 1 - i] === "1") {
            resultCoeficients = combine(resultCoeficients, coeficients, totalCards);
        }

        coeficients = combine(coeficients, coeficients, totalCards);
    }

    let a = resultCoeficients[0], b = resultCoeficients[1];
    console.log(`(${a} * x + ${b}) mod ${totalCards} = ${cardN}`);
    // console.log(`./adv22-p2 ${a} ${b} ${totalCards} ${times}`);
    return resultCoeficients;
}

function testTracerBack(cards, times) {
    let shuffled1 = shuffle(cards, times);

    let c = traceBack(3, cards, times);
    let shuffled = new Array(cards);
    for (let i = 0; i < cards; i++)
        shuffled[(c[0] * i + c[1] + 20 * cards) % cards] = i;


    for (let i = 0; i < cards; i++) 
        if (shuffled1[i] != shuffled[i]) {
            console.log("WRONG CARD ", i, shuffled[i], "!=", shuffled1[i]);
        }
    console.log("done");
}

console.log("Part One:", shuffle(10007).indexOf(2019));

console.log(traceBack(2020, 119315717514047, 101741582076661));
//testTracerBack(10007, 13);
//console.log(shuffled);
// console.log("Trace back: ", traceBack(3, 7, 1));
// console.log("Part Two: ", traceBack(2020, 119315717514047, 101741582076661));
//console.log("Part Two:", shuffle(119315717514047, 101741582076661)[2020]);
