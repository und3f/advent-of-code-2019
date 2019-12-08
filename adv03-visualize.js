#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv03.txt", 'utf8').trim();
let wiresDirections = contents.split("\n").map(a => a.split(","));

function findWirePoints(directions) {
    let position = [0, 0];
    let points = [position.slice()];
    for (let i in directions) {
        let directionString = directions[i];
        let direction = directionString[0];
        let steps = parseInt(directionString.substr(1));

        switch (direction) {
            case "U":
                position[0] -= steps;
                break;
            case "D":
                position[0] += steps;
                break;
            case "L":
                position[1] -= steps;
                break;
            case "R":
                position[1] += steps;
                break;
        }
        points.push(position.slice());
    }
    return points;
}

let wires = wiresDirections.map(directions => findWirePoints(directions));

fs.writeFileSync("adv03-wire1.txt", wires[0].map(position => position.reverse().join(" ")).join("\n"), 'utf8');
fs.writeFileSync("adv03-wire2.txt", wires[1].map(position => position.reverse().join(" ")).join("\n"), 'utf8');

const { spawn } = require('child_process');
let plot = spawn('gnuplot');
plot.stdin.write('plot "adv03-wire1.txt" with lines, "adv03-wire2.txt" with lines' + "\n");
