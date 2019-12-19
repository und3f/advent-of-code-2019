#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');

let contents = fs.readFileSync("adv19.txt", 'utf8').trim();
let originalIntcode = contents.split(",").map(a => parseInt(a));
let x = 0, y = 0;

let size = 50;
let shipSize = 100;

function Map(intCode, cacheSize) {
    this.map = [];
    this.intCode = intCode;
    this.cacheSize  = cacheSize;
}

Map.prototype.isBeam = function(y, x) {

    let k = x * 10000 + y;
    let v = this.map[k];

    if (v != null)
        return v;

    let input = [x, y];
    let map = this.map;
    new IntcodeComputer(
        this.intCode,
        () => input.pop(),
        v => map[k] = v)
        .start();

    return map[k];
}

function findSanta(shipSize) {
    let map = new Map(originalIntcode, shipSize + 10);
    let minY = 0;
    let sx, sy;


    let x = 0
    for (y = minY; map.isBeam(y,x) == 0; y++) {}
    minY = y;


    for (; sy == undefined; x++) {
        let y;
        for (y = minY - 1; map.isBeam(y,x) == 0 && y < minY + 3; y++) {}
        if (!map.isBeam(y,x))
            continue;
        minY = y;

        for (; map.isBeam(y,x) != 0; y++) {
            shipFitting = true;
            [[y, x], [y + shipSize - 1, x], [y, x + shipSize - 1], [y + shipSize - 1, x + shipSize - 1]].forEach(corner =>
                shipFitting = shipFitting && map.isBeam(corner[0], corner[1])
            );

            if (shipFitting) {
                return [y, x];
            }
        }
    }
}

function calculateBeamSize(mapSize) {
    let beamSize = 0;
    for (let x = 0; x < mapSize; x++) {
        for (let y = 0; y < mapSize; y++) {
            let input = [x, y];
            new IntcodeComputer(
                originalIntcode,
                () => input.pop(),
                v => {if (v == 1) beamSize++ })
                .start();
        }
    }
    return beamSize
}

console.log("Part One:", calculateBeamSize(size));

let c = findSanta(shipSize);
console.log("Part Two:", c[1] + c[0] * 10000);

