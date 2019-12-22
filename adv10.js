#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv10.txt", 'utf8').trim();

let mapLines = contents.split("\n");
let height = mapLines.length;
let width = mapLines[0].length;
let map = mapLines.map(l => l.split("").map(v => v == '#' ? true : false));

function calculateVisibleAsteroids(map, y0, x0) {
    let visible = 1;
    let stations = {}
    // let nmap = new Array(map.length).fill(null).map(a => new Array(map[0].length).fill("  "));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!map[y][x] || (y == y0 && x == x0))
                continue;

            let line = Math.atan2(y - y0, x - x0);
            // nmap[y][x] = Math.round(line * 100.) / 100;

            stations[line] = (stations[line] || 0) + 1;
        }
    }
    /*
    console.log(stations);
    console.log(nmap);
    */
    return Object.keys(stations).length;
}

function findBestAsteroid(map) {
    let bestAsteroid = [0];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!map[y][x])
                continue;
            let visible = calculateVisibleAsteroids(map, y, x);
            if (visible > bestAsteroid[0]) {
                bestAsteroid = [visible, y, x];
            }
        }
    }
    return bestAsteroid;
}

function distance(y0, x0, y1, x1) {
    return Math.sqrt(Math.pow(y0 - y1, 2) + Math.pow(x0 - x1, 2));
}

function findVaporizationOrder(map, y0, x0) {
    // console.log(y0, x0);
    let asteroidLines = {};
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!map[y][x] || (y == y0 && x == x0))
                continue;

            let line = (Math.atan2(y - y0, x - x0) * 180 / Math.PI + 90 + 360) % 360;
            if (asteroidLines[line] == null)
                asteroidLines[line] = []
            asteroidLines[line].push([x, y, distance(y0, x0, y, x)]);
        }
    }

    let startDirection = Math.atan2(-1, 0);
    let asteroids = Object.keys(asteroidLines).map(k => parseFloat(k)).sort((a,b) => a - b).map(k => asteroidLines[k]);

    asteroids = asteroids.map(l => l.sort((a, b) => a[2] - b[2]));
    // console.log(asteroidLines);
    let asteroidOrder = [];

    let a;
    do {
        a = null;
        for (let i = 0; i < asteroids.length; i++) {
            let b = asteroids[i].shift();
            if (b == null)
                continue;
            a = b;

            asteroidOrder.push(a);
        }
    } while (a != null);
    return asteroidOrder;
}

let monitoringStation = findBestAsteroid(map, 2, 4);
console.log("Part One:", monitoringStation[0]);

let order = findVaporizationOrder(map, ...(monitoringStation.slice(1)));
let asteroid = order[200 - 1];

console.log("Part Two:", asteroid[0] * 100 + asteroid[1]);
