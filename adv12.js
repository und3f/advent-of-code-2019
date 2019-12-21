#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv12.txt", 'utf8').trim();
let moonRe = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
let moons = contents.split("\n").map(l => {
    let match = moonRe.exec(l);
    return [match.slice(1,4).map(s => parseInt(s)), [0, 0, 0]];
});

let moonsOriginal = moons.map(moon => moon.map(k => k.slice()));

function simulate(moons) {
    let isStatic = moons.length * 3;
    for (let i = 0; i < moons.length - 1; i++) {
        for (let j = i+1; j < moons.length; j++) {
            for (let k = 0; k < 3; k++) {
                let mp = [moons[i], moons[j]];
                let c = mp[0][0][k] - mp[1][0][k]

                if (c == 0)
                    continue;
                if (c > 0)
                    mp = mp.reverse();

                ++mp[0][1][k];
                --mp[1][1][k];
            }
        }
    }

    for (let i = 0; i < moons.length; i++)
            for (let k = 0; k < 3; k++) {
                let v = moons[i][1][k]
                moons[i][0][k] += moons[i][1][k]
                if (v == 0)
                    isStatic--;
            }

    return isStatic;
}

function moonEnergy(moon) {
    let sum = 1;
    for (let j = 0; j < moon.length; j++) {
        let asum = 0
        for (let i = 0; i < moon[j].length; i++)
            asum += Math.abs(moon[j][i]);
        sum *= asum;
    }
    return sum;
}

function totalEnergy(moons) {
    let sum = 0;
    for (let i in moons)
        sum += moonEnergy(moons[i]);
    return sum;
}

function areMoonsCoordinateEqual(moons1, moons2, k) {
    for (let i = 0; i < moons1.length; i++)
        if (moons1[i][0][k] != moons2[i][0][k])
            return false;
    return true;
}

function lcm(A) {   
    var  n = A.length, a = Math.abs(A[0]);
    for (var i = 1; i < n; i++)
     { var b = Math.abs(A[ i ]), c = a;
       while (a && b){ a > b ? a %= b : b %= a; } 
       a = Math.abs(c*A[ i ])/(a+b);
     }
    return a;
}

// console.log(moons);
for (let i = 0; i < 1000; i++)
    i, simulate(moons);

console.log("Part One:", totalEnergy(moons));

moons = moonsOriginal.map(moon => moon.map(k => k.slice()));

let step = 0;
let periods = new Array(3);
do {
    step++;
    simulate(moons);
    for (let k = 0; k < 3; k++) {
        if (periods[k] != null)
            continue;

        let isStatic = true;
        for (let i = 0; i < moons.length; i++) {
            if (moons[i][1][k] != 0) {
                isStatic = false;
                break;
            }
        }
        if (isStatic) {
            if (areMoonsCoordinateEqual(moonsOriginal, moons, k))
                periods[k] = step;
        }
    }
} while(!(periods[0] && periods[1] && periods[2]))

console.log("Part Two:", lcm(periods));
