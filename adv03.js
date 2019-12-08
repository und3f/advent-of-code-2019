#!/usr/bin/env node

const fs = require('fs');


let contents = fs.readFileSync("adv03.txt", 'utf8').trim();
let wiresDirections = contents.split("\n").map(a => a.split(","));

function findWirePoints(directions) {
    let points = {};
    let position = [0, 0];

    let step = 1;

    for (let i in directions) {
        let directionString = directions[i];
        let direction = directionString.substr(0, 1);
        let steps = directionString.substr(1);

        for (let j = 0; j < steps; j++) {
            switch (direction) {
                case "U":
                    position[0] --;
                    break;
                case "D":
                    position[0] ++;
                    break;
                case "L":
                    position[1] --;
                    break;
                case "R":
                    position[1] ++;
                    break;
            }
            let key = position.join(",");

            if (points[key] == null)
                points[key] = step

            step++;
        }
    }
    return points;
}

function mDistance(point) {
    return Math.abs(point[0]) + Math.abs(point[1]);
}

let wiresStartPoint = [];
let wires = wiresDirections.map(directions => findWirePoints(directions));

let intersections = Object.keys(wires[0])
    .filter(value => wires[1][value])
    .map(pointS => [...pointS.split(",").map(v => parseInt(v)), wires[0][pointS] + wires[1][pointS]])
    .sort((a, b) => a[2] - b[2]);

let intersection = intersections.reduce((accumulator, currentValue) => mDistance(accumulator) > mDistance(currentValue) ? currentValue : accumulator, intersections[0]);

console.log(intersections);
console.log("Part One:", mDistance(intersection));
console.log("Part Two:", intersections[0][2]);
