#!/usr/bin/env node

const fs = require('fs');
let contents = fs.readFileSync("adv18.txt", 'utf8').trim();

let map = contents.split("\n").map(l => l.split(""));
let height = map.length;
let width = map[0].length;


let directions = [
    [-1, 0],
    [ 0, 1],
    [ 1, 0],
    [ 0,-1]
];

function findAdjancedPoints(map, position) {
    let adjanced = [];
    for (let j in directions) {
        let d = directions[j];
        let np = [position[0] + d[0], position[1] + d[1]];
        if (np[0] < 0 || np[0] >= map.length || np[1] < 0 || np[1] >= map[0].length || map[np[0]][np[1]] == '#')
            continue;

        adjanced.push(np);
    }
    return adjanced;
}

function findItems(map) {
    let items = {};
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let s = map[y][x];
            if (s >= 'a' && s <= 'z')
                items[s] = {
                    item: s,
                    position: [y, x]
                };
            else if (s == '@')  {
                if (items[s] == null)
                    items[s] = [];
                items[s].push({
                    item: s,
                    position: [y, x]
                })
            }
        }
    }

    return items;
}

function traceFromPoint(originalMap, startPosition, items) {
    let map = originalMap.map(a => a.slice());
    let distances = [];

    map[startPosition[0]][startPosition[1]] = '#';

    let tracing = findAdjancedPoints(map, startPosition).map(a => [a, 1, []]);

    while (tracing.length > 0) {
        // console.log('Tracing:', tracing);
        let newTracing = [];
        tracing.forEach(edge => {
            let p = edge[0];

            // console.log('Edge:', edge, p);
            let s = map[p[0]][p[1]];
            map[p[0]][p[1]] = '#';
            // console.log(map.map(e => e.join("")).join("\n"));
            let adjanced = findAdjancedPoints(map, p);

            let newObstacles = [];
            if (s != '.' && s != '@') {
                newObstacles.push(s);

                if (s >= 'a' && s <= 'z') {
                    let vertex = s;

                    let distance = edge[1];
                    let obstacles = edge[2];
                    distances.push([vertex, distance, obstacles]);
                }
            }

            newTracing = newTracing.concat(adjanced.map(a => [a, edge[1] + 1, newObstacles.concat(edge[2])]));

        });
        tracing = newTracing;
    }

    return distances;
}

function buildMapGraph(originalMap) {
    let items = findItems(map);

    for (let i = 0; i < items['@'].length; i++) {
        items['@'][i].distances = traceFromPoint(map, items['@'][i].position, items);
    }

    let keys = Object.keys(items).filter(e => e != '@');
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        items[key].distances = traceFromPoint(map, items[key].position, items);
    }

    // console.log(util.inspect(items, {showHidden: false, depth: null}))
    return items;
}

function pathsToKeys(startVertex, usedKeys, debug) {
    let tracing = startVertex.siblings.map(a => [...a, []]);
    let visited = {};
    let keys = {};
    visited[startVertex.position] = 0;

    if (debug) console.log(usedKeys);
    if (debug) console.log(startVertex.item, tracing);

    while (tracing.length > 0) {
        let nextTracing = [];
        tracing.forEach(edge => {
            let vertex = edge[0];
            let p = vertex.position;
            let path = edge.slice(1,3);
            path[1] = [...(path[1]), vertex];

            if (visited[p]) {
                if (visited[p][0] > edge[1]) {
                    visited[p] = path;
                }

                return;
            }

            visited[p] = path;
            let item = vertex.item;
            if (item >= 'A' && item <= 'Z' && !usedKeys.has(item.toLowerCase()))
                return;

            if (item >= 'a' && item <= 'z' && !usedKeys.has(item)) {
                keys[item] = vertex.position;
                return;
            }
            nextTracing = nextTracing.concat(vertex.siblings.map(sibling => [sibling[0], sibling[1] + edge[1], [...(edge[2]), vertex]]));
        });
        tracing = nextTracing;
    }
    
    return Object.keys(keys).map((key, index) => {
        return [key, visited[keys[key]]]
    }).sort((a, b) => a[1][0] - b[1][0]);
}

function solve(items, startVariant) {
    let variants = startVariant;

    let allKeys = Object.keys(items).filter(e => e != '@');

    let visitedVariants = {};
    let solution = [Infinity];

    while (variants.length > 0) {
        let variant = variants.shift();
        // console.log("VARIANT", variant[2]);
        const variantSteps = variant[0];
        const _path = variant[2];

        let collectedKeys = new Set(_path);
        let possibleKeys = new Set(allKeys.filter(k => !collectedKeys.has(k)));

        if (collectedKeys.size == allKeys.length) {
            if (solution[0] > variant[0]) {
                solution = [variant[0], variant[2]];
                console.log("FOUND NEW SOLUTION", solution[0], solution[1].join(""));
            }
            continue;
        }

        for (let v in variant[1]) {
            const vertex = variant[1][v];
            let paths = vertex.distances
                .filter(d => possibleKeys.has(d[0]))
                .filter(d => -1 == d[2].findIndex(k => !collectedKeys.has(k.toLowerCase())))

            let positions = variant[1].slice(0, +v).concat(variant[1].slice(+v+1));
            // console.log("Paths", paths, positions.length, [0,v], [v+1], variant[1].slice(0, v), variant[1].slice(v+1, variant[1].length), v);

            /*
            console.log("Possible keys", possibleKeys);
            console.log("Collected keys", collectedKeys);
            console.log("PATHS", paths);
            */

            for (let i = 0; i < paths.length; i++) {

                let keyPath = paths[i];
                const steps = keyPath[1];
                const variantPathSteps = variantSteps + steps
                let item = keyPath[0];

                let path = _path.slice();
                path.push(item);
                let v    = items[item];


                let lpositions = positions.concat([v]);
                let key = [...(lpositions.map(e => e.position.join(","))), path.slice().sort().join("")];
                // console.log(key);
                // console.log("VARIANT", key, variantPathSteps);

                if ((visitedVariants[key] || Infinity) < variantPathSteps) {
                    // console.log("ABANDON", key, variantPathSteps, " > ", visitedVariants[key]);
                    continue;
                }
                visitedVariants[key] = variantPathSteps;

                if (variantPathSteps > solution[0])
                    continue;

                variants.push([variantPathSteps, positions.concat([v]), path])
            }
        }

        variants = variants.sort((a, b) => b[2].length - a[2].length || a[0] - b[0]);
        // console.log("Total variants:", variants.length);
    }
    return solution;
}

function solvePuzzle(map) {
    let items = buildMapGraph(map);

    //console.log(util.inspect(startVertex, {showHidden: false, depth: null}))
    return solve(items, [[0, items['@'], []]]);
}

function solvePuzzleWithDroids(map) {
    let p = findItems(map)['@'][0].position;
    let y = p[0];
    let x = p[1];
    for (let y = p[0] - 1; y <= p[0] + 1; y++)
        map[y][p[1]] = '#'
    for (let x = p[1] - 1; x <= p[1] + 1; x++)
        map[p[0]][x] = '#'

    for (let y = p[0] - 1; y <= p[0] + 1; y += 2)
        for (let x = p[1] - 1; x <= p[1] + 1; x += 2)
            map[y][x] = '@';
    console.log(map.map(e => e.join("")).join("\n"));

    let items = buildMapGraph(map);
    return solve(items, [[0, items['@'], []]]);
}

//console.log(map.map(e => e.join("")).join("\n"));
console.log(map.map(e => e.join("")).join("\n"));
const util = require('util')

//console.log(startVertex.siblings);
let singleSolution = solvePuzzle(map);

console.log("Part One:", singleSolution[0]);

let droidsSolution = solvePuzzleWithDroids(map);

console.log("Part Two:", droidsSolution[0]);

