#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv10.txt", 'utf8').trim();

let mapLines = contents.split("\n");
let height = mapLines.length;
let width = mapLines[0].length;
let map = mapLines.map(l => l.split("").map(v => v == '#' ? true : false));
console.log(map);

function calculateVisibleAsteroids(map, y0, x0) {
    let visible = 1;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!map[y][x] || (y == y0 && x == x0))
                continue;
            console.log(y, x, Math.atan2(y - y0, x - x0));

            let coordinate = [y, x];
            let coordinate0 = [y0, x0];
            if (Math.abs(x - x0) > Math.abs(y - y0)) {
                coordinate = coordinate.reverse();
                coordinate0 = coordinate0.reverse();
            }

            let step = 1;
            if (coordinate[0] > coordinate0[0])
                step = -1;

            for (let c = coordinate; c < coordinate0; c += step) {
            }
        }
    }
    return visible;
}

calculateVisibleAsteroids(map, 4, 3);

console.log("Part One:", height, width);

console.log("Part Two:", );
