#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv08.txt", 'utf8').trim();
let code = contents;

let width = 25, height = 6;
let layers = [];
let i = 0;
while (i < code.length) {
    let layer = [];
    layers.push(layer);
    for (let y = 0; y < height; y++) {
        let row = [];
        layer.push(row);
        for (let x = 0; x < width; x++) {
            row.push(code[i++]);
        }
    }
}

function calculateDigitsOnLayer(layer, digit) {
    let total = 0;

    for (let y in layer) {
        for (let x in layer[y]) {
            if (layer[y][x] == digit)
                total++
        }
    }
    return total;
}


let fewestZerosLayer = [width * height, null];
for (let i in layers) {
    let zeros = calculateDigitsOnLayer(layers[i], 0);

    if (zeros < fewestZerosLayer[0])
        fewestZerosLayer = [zeros, layers[i]];
}

function mergeLayers(layers) {
    let finalLayer = layers[0];
    for (let i = 1; i < layers.length; i++) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (finalLayer[y][x] == 2) {
                    finalLayer[y][x] = layers[i][y][x];
                }
            }
        }
    }
    return finalLayer;
}

function displayImage(layer) {
    return layer.map(row => row.map(d => d == 0 ? " " : "#").join("")).join("\n");

}

console.log("Part One:", calculateDigitsOnLayer(fewestZerosLayer[1], 1) * calculateDigitsOnLayer(fewestZerosLayer[1], 2));
console.log("Part Two:");
console.log(displayImage(mergeLayers(layers)));
