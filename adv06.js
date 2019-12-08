#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv06.txt", 'utf8').trim();

let orbitsList = contents.split("\n").map(a => a.trim().split(")"));


let orbits = {};
for (let i in orbitsList) {
    let source = orbitsList[i][0];
    let destination = orbitsList[i][1];


    if (orbits[source] == undefined) {
        orbits[source] = {
            parent: null,
            childs: [],
            name: source,
        }
    }

    if (orbits[destination] == undefined) {
        orbits[destination] = {
            parent: null,
            childs: [],
            name: destination,
        }
    }

    orbits[destination].parent = orbits[source];
    orbits[source].childs.push(orbits[destination]);
}

function calculateOrbits(node) {
    let totalOrbits = 0;
    let cNode = node;

    while (cNode.parent != null) {
        totalOrbits++;
        cNode = cNode.parent;
    }
    return totalOrbits;
}

function calculateTotalOrbits(orbits) {
    let totalOrbits = 0;
    for (let i in orbits) {
        totalOrbits += calculateOrbits(orbits[i]);
    }
    return totalOrbits;
}


function calculateOrbitTransfers(orbits) {
    let you, san;
    for (let i in orbits) {
        if (orbits[i].name == "YOU")
            you = orbits[i];
        else if (orbits[i].name == "SAN")
            san = orbits[i];
    }
    let orbitsDistance = {};

    orbitsDistance[you.name] = 0;
    let visitingOrbits = [you];
    do {
        let nextOrbits = [];
        for (let i in visitingOrbits) {
            let currentOrbit = visitingOrbits[i];

            let testingOrbits = [...currentOrbit.childs];
            if (currentOrbit.parent != null)
                testingOrbits.push(currentOrbit.parent)

            for (let o in testingOrbits) {
                let testingOrbit = testingOrbits[o];
                if (orbitsDistance[testingOrbit.name] != undefined)
                    continue;

                orbitsDistance[testingOrbit.name] = orbitsDistance[currentOrbit.name] + 1;
                nextOrbits.push(testingOrbit);

                if (testingOrbit == san) {
                    return orbitsDistance[san.name] - 2;
                }
            }

        }
        visitingOrbits = nextOrbits;
    } while (visitingOrbits.length > 0)
    return -1;
}

console.log("Part One:", calculateTotalOrbits(orbits));
console.log("Part Two:", calculateOrbitTransfers(orbits));
