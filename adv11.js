#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');

let contents = fs.readFileSync("adv11.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));

let directions = [
    [ 0,-1],
    [-1, 0],
    [0,  1],
    [ 1, 0]
];

let direction = 1;

let size = 100;
let map = new Array(size).fill(null).map(a => new Array(size).fill('?'));

let position = [size/2, size/2];
let startPosition = position.slice();

let out = [];
let inputCb = function() {

    while (out.length >= 2) {
        let paint = out.shift();
        let turn = out.shift();
        direction = (direction + (turn == 0 ? 3 : 1)) % 4;
        map[position[0]][position[1]] = paint == 1 ? '#' : '.';
        position[0] += directions[direction][0];
        position[1] += directions[direction][1];

        if (position[0] == startPosition[0] && position[1] == startPosition[1]){
        }

    }

    let color = 0;
    if (map[position[0]][position[1]] == '#') {
        color = 1;
    }

    return color;
}

new IntcodeComputer(originalIntcode, inputCb, v => out.push(v)).start();
let painted = 0;
map.forEach(a => a.forEach(v => {if(v != '?') painted++}));
console.log("Part One:", painted);

position = [1, 0];
direction = 1;
map = new Array(8).fill(null).map(a => new Array(44).fill('?'));
startPosition = position.slice();
map[position[0]][position[1]] = '#';
out = [];
new IntcodeComputer(originalIntcode, inputCb, v => out.push(v)).start();

console.log("Part Two:");
console.log(map.map(a => a.join("")).join("\n"));
