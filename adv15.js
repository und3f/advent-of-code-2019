#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');

let contents = fs.readFileSync("adv15.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));

let size = 50;
let map = new Array(size).fill(null).map(a => new Array(size).fill(" "));
let position = [size/2, size/2];
let moves = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
];

let rotateClockWise = [
    3,
    4,
    2,
    1
]

let rotateCounterClockWise = [
    4,
    3,
    1,
    2
]


let move = 1;
let oxySystemPosition = [];
let startPosition = [...position];

map[position[0]][position[1]] = 'D';
let out = [];

let computer;

let steps = 5700;
let inputCb = function() {
    let reply = out.pop();

    // console.log("moved:", moves[move-1], reply);
    let y = position[0] + moves[move - 1][0];
    let x = position[1] + moves[move - 1][1];
    switch (reply) {
        case 0:
            map[y][x] = '#';

            move = rotateClockWise[(move - 1)];
            break;
        case 1:
            map[position[0]][position[1]] = '.';
            position = [y, x];
            map[y][x] = 'D';
            move = rotateCounterClockWise[(move - 1)];
            break;
        case 2:
            oxySystemPosition = [y,x];
            map[y][x] = 'O';
            map[startPosition[0]][startPosition[1]] = '1';
            position = [y, x];
            //stop = true;
            break;
    }

    if (steps-- == 0)
        computer.stop = true;

    /*
    console.log(map.map(a => a.join("")).join("\n"));
    console.log("Next move: ", move);
    */

    return move;
};

computer = new IntcodeComputer(originalIntcode, inputCb, v => out.push(v))
computer.start();

map[oxySystemPosition[0]][oxySystemPosition[1]] = 'O';
map[startPosition[0]][startPosition[1]] = '1';
// console.log(map.map(a => a.join("")).join("\n"));

let positions = [startPosition];
let currentDistance = -1;
let distance = 0;
let mapDistance = map.map(a => a.slice());
do {
    currentDistance++;

    let nextPositions = [];
    positions.forEach(p => {

        mapDistance[p[0]][p[1]] = currentDistance % 10;
        moves.forEach(r => {
            let y = p[0] + r[0]
            let x = p[1] + r[1];

            switch (mapDistance[y][x]) {
                case '.':
                case 'D':
                    nextPositions.push([y, x]);
                    break;
                case 'O':
                    distance = currentDistance + 1;
                    break;
            }
        });
    });

    positions = nextPositions;
    /*
    console.log(mapDistance.map(a => a.join("")).join("\n"));
    console.log(positions, distance);
    */
} while (distance === 0);

positions = [oxySystemPosition];
time = -1;

do {

    let nextPositions = [];
    positions.forEach(p => {

        map[p[0]][p[1]] = 'O';
        moves.forEach(r => {
            let y = p[0] + r[0]
            let x = p[1] + r[1];

            switch (map[y][x]) {
                case '.':
                case 'D':
                    nextPositions.push([y, x]);
                    break;
                case 'O':
                    distance = currentDistance + 1;
                    break;
            }
        });
    });

    positions = nextPositions;
    time++;
    // console.log(map.map(a => a.join("")).join("\n"));
} while (positions.length > 0);

console.log("Part One:", distance);
console.log("Part Two:", time);
