#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');

let contents = fs.readFileSync("adv17.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));
let out = [];

new IntcodeComputer(originalIntcode, () => 1, (v) => out.push(v)).start();
let map = out.map(v => String.fromCharCode(v)).join("").trim().split("\n");

map = map.map(a => a.split(""));
let intersections = [];

let directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
];

for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[y].length - 1; x++) {
        if (map[y][x] != '#') {
            if (map[y][x] == '^')
                start = [y, x];
            continue;
        }

        let adjanced = 0;
        for (let i in directions) {
            let p = directions[i];
            if (map[y + p[0]][x + p[1]] == '#')
                adjanced++
        }

        if (adjanced == 4) {
            intersections.push([y,x]);
            // map[y][x] = 'O';
        }
    }
}

console.log(map.map(a => a.join("")).join("\n"));

let sum = intersections.reduce((total, v) => total += v[0] * v[1], 0);

console.log("Part One:", sum);

let position = start;
let path = [];
let direction = 0;
let rotations = ['L', 'R'];

let nextDirection = direction;
do {
    direction = nextDirection;
    nextDirection = -1;

    let r;
    for (r = 0; r < rotations.length; r++) {
        let tryDirection = (r * 2 + direction + 3) % 4;
        let nextDirectionC = directions[tryDirection];

        let y = position[0] + nextDirectionC[0];
        let x = position[1] + nextDirectionC[1];

        if (y >= 0 && x >= 0 && y < map.length && x < map[y].length && map[y][x] == '#') {
            nextDirection = tryDirection;
            break;
        }
    }

    if (nextDirection == -1)
        break;

    let v = directions[nextDirection];
    let y = position[0] + v[0], x = position[1] + v[1];
    let steps = 0;
    while ( y >= 0 && x >= 0 && y < map.length && x < map[y].length && map[y][x] == '#') {
        steps++;
        y += v[0], x += v[1];
    }
    position = [y - v[0], x - v[1]];
    path.push(rotations[r], steps);
} while (nextDirection != -1);

console.log("PATH:", path.join(","));


originalIntcode[0] = 2;

let input = 
`A,B,A,B,C,A,B,C,A,C
R,6,L,6,L,10
L,8,L,6,L,10,L,6
R,6,L,8,L,10,R,6
y\n`.split("").map(c => c.charCodeAt(0));

let value;

new IntcodeComputer(originalIntcode, () => {return input.shift()}, (v) => {value = v;}).start();
console.log("Part Two:", value);
