#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv14.txt", 'utf8').trim();

function extractChemicalAmount(s) {
    return s.split(", ").map(ac => {let vo = ac.split(" "); vo[0] = parseInt(vo); return vo});
}

let requirements = {};
contents.split("\n").forEach(l => {
    let s = l.trim().split(" => ");
    let r = extractChemicalAmount(s[1])[0];
    let p = extractChemicalAmount(s[0]);
    requirements[r[1]] = [r[0], p];
});
calculateRequirementDepth('FUEL');

function calculateRequirementDepth(ORE) {
    if (ORE == 'ORE')
        return 0;

    let r = requirements[ORE];
    if (r[2] != undefined)
        return r[2];

    let depths = r[1].map(ore => calculateRequirementDepth(ore[1]) + 1);
    let maxDepth = depths.reduce((a, v) => Math.max(a, v), 0);
    r[2] = maxDepth;
    return maxDepth;
}

function mergeRequirements(requirements) {
    let merge = {};
    requirements.forEach(e => {
        if (merge[e[1]] != null)
            merge[e[1]] += e[0];
        else
            merge[e[1]] = e[0];
    });
    return Object.entries(merge).map(([key, value]) => ([value,key]));
}

function produceResource(amount, resourceName) {
    let resource = requirements[resourceName];

    let times = Math.ceil(amount / resource[0]);
    return resource[1].map(r => [r[0] * times, r[1]]);
}

function calculateFuelRequirement(amount) {
    let fuel = requirements.FUEL;
    let requires = produceResource(amount, 'FUEL');
    let totalFuel = 0;
    while (requires.length >= 1) {
        let maxDepthRequirement = requires.sort((b, a) => requirements[a[1]][2] - requirements[b[1]][2])[0];
        if (requirements[maxDepthRequirement[1]][2] == 0)
            break;
        let newRequirements = produceResource(maxDepthRequirement[0], maxDepthRequirement[1])
        requires.forEach(e => {
            if (e == maxDepthRequirement)
                return;
            newRequirements.push(e);
        });
        requires = mergeRequirements(newRequirements);

        requires = requires.filter(e => {
            if( e[1] == 'ORE') {
                totalFuel += e[0];
                return false;
            }
            return true;
        });
    }
    return totalFuel
}

function calculateMaxProducedFuel(oreAmount) {
    let singleFuelOreRequirement = calculateFuelRequirement(1);
    let maxProducedFuel = Math.ceil(oreAmount/singleFuelOreRequirement);
    let oreRequirement = calculateFuelRequirement(maxProducedFuel);
    let bestProducedFuel = maxProducedFuel;


    let step;
    do {
        bestProducedFuel = maxProducedFuel;
        step = Math.floor((oreAmount - oreRequirement)/singleFuelOreRequirement) || 1;

        maxProducedFuel += step;
        oreRequirement = calculateFuelRequirement(maxProducedFuel);
    } while (oreRequirement <= oreAmount);

    return bestProducedFuel;
}

console.log("Part One:", calculateFuelRequirement(1));
console.log("Part Two:", calculateMaxProducedFuel(1000000000000));
