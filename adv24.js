#!/usr/bin/env node

const fs = require('fs');

let contents = fs.readFileSync("adv24.txt", 'utf8').trim();
let initialState = contents.split("\n").map(l => l.split("").map(e => e == '#'));

function showState(state) {
    console.log(state.map(r => r.map(e => e ? '#' : '.').join("")).join("\n"));
}

function spendMinute(state) {
    let newState = state.map(a => a.slice());
    
    for (let y = 0; y < state.length; y++) {
        for (let x = 0; x < state[0].length; x++) {
            let bugsAround = 0;
            if (y > 0 && state[y-1][x])
                bugsAround++
            if (y < state.length-1 && state[y+1][x])
                bugsAround++
            if (x > 0 && state[y][x-1])
                bugsAround++
            if (x < state.length-1 && state[y][x+1])
                bugsAround++

            if (state[y][x]) {
                if (bugsAround != 1)
                    newState[y][x] = false;
            } else {
                if (bugsAround == 1 || bugsAround == 2)
                    newState[y][x] = true;
            }
        }
    }
    return newState;
}

function calculateBiodiversity(state) {
    let point = 1;
    let totalPoints = 0;

    for (let y = 0; y < state.length; y++) {
        for (let x = 0; x < state[0].length; x++) {
            if (state[y][x])
                totalPoints += point;
            point *= 2;
        }
    }
    return totalPoints;
}


function partOne(initialState) {
    let states = {};
    let bioDiversity;

    let state = initialState;
    do {
        state = spendMinute(state);
        bioDiversity = calculateBiodiversity(state);
        if (states[bioDiversity] != null)
            break;
        states[bioDiversity] = state;
    } while (true);

    return bioDiversity;
}

function Space(initialState, spaceId, adjancedSpace) {
    this.state = initialState;
    if (this.state == null) {
        this.isEmpty = true;
        this.state = new Array(size).fill(null).map(a => new Array(size).fill(false));
    }

    this.spaceId = spaceId || 0;
    if (spaceId > 0)
        this.innerSpace = adjancedSpace;
    else if (spaceId < 0)
        this.outterSpace = adjancedSpace;

    // console.log("NEW SPACE", this.spaceId);
}

Space.prototype.generateSpaceId = function (spaceDirection) {
    // console.log(spaceDirection);
    if (spaceDirection == 'innerSpace')
        return this.spaceId - 1;

    return this.spaceId + 1;
}

Space.prototype.createSpace = function(space) {
    if (this[space] == null)
        this[space] = new Space(null, this.generateSpaceId(space), this)
}

Space.prototype.showState = function() {
    if (this.isEmpty)
        return;

    if (this.spaceId <= 0 && this.innerSpace != null)
        this.innerSpace.showState();

    console.log("Space", this.spaceId);

    let arr = this.state.map(r => r.map(e => e ? '#' : '.'));
    arr[middlePoint][middlePoint] = '?';
    console.log(arr.map(a => a.join("")).join("\n"));

    if (this.spaceId >= 0 && this.outterSpace != null)
        this.outterSpace.showState();

}

Space.prototype.countBugs = function() {
    if (this.isEmpty)
        return 0;
    let sum = 0;
    if (this.spaceId <=0)
        sum += this.innerSpace.countBugs();
    if (this.spaceId >=0)
        sum += this.outterSpace.countBugs();

    for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
            if (this.state[y][x])
                sum++;

    return sum;
}

const size = 5;
const last = size - 1;
const middlePoint = Math.ceil(size / 2) - 1;
const spaceDirections = {
    InnerUpperSpace: [[1, 2], [1, 2]],
    InnerBottomSpace: [[3, 2], [3, 2]],
    InnerLeftSpace: [[2, 1], [2, 1]],
    InnerRightSpace: [[2, 3], [2, 3]],

    OutterUpperSpace: [[0, 0], [0, last]],
    OutterBottomSpace: [[last, 0], [last, last]],
    OutterLeftSpace: [[0, 0], [last, 0]],
    OutterRightSpace: [[0, last], [last, last]],
};

const innerDirections = [
    spaceDirections.InnerUpperSpace,
    spaceDirections.InnerBottomSpace,
    spaceDirections.InnerLeftSpace,
    spaceDirections.InnerRightSpace,
];

const outterDirections = [
    spaceDirections.OutterUpperSpace,
    spaceDirections.OutterBottomSpace,
    spaceDirections.OutterLeftSpace,
    spaceDirections.OutterRightSpace,
];

Space.prototype.getBugsCount = function(range) {
    if (this.isEmpty)
        return 0;

    let count = 0;
    let state = this.state;

    for (let y = range[0][0]; y <= range[1][0]; y++)
        for (let x = range[0][1]; x <= range[1][1]; x++)
            if (state[y][x])
                count++;

    // console.log("Get bugs count:", this.spaceId, range, count);
    return count;
}

Space.prototype.checkBugsAround = function (directions, space) {
    // console.log("SPACE CHECKING", this.spaceId, directions, space.spaceId);
    for (let i = 0; i < directions.length; i++) {
        let bugs = space.getBugsCount(directions[i]);
        if (bugs == 1 || bugs == 2)
            return true;
    }
    return false;
}

Space.prototype.spendMinute = function() {
    const state = this.state;
    let newState = state.map(a => a.slice());

    if (this.isEmpty) {
        if (this.spaceId < 0) {
            if (!this.checkBugsAround(innerDirections, this.outterSpace))
                return;
        } else if (this.spaceId > 0) {
            if (!this.checkBugsAround(outterDirections, this.innerSpace))
                return;
        }
        delete this.isEmpty;
    }

    if (this.spaceId <= 0)
        this.createSpace("innerSpace");
    if (this.spaceId >= 0)
        this.createSpace("outterSpace");
    

    let outterBugs = {
        upper: this.outterSpace.getBugsCount(spaceDirections.InnerUpperSpace),
        bottom: this.outterSpace.getBugsCount(spaceDirections.InnerBottomSpace),
        left: this.outterSpace.getBugsCount(spaceDirections.InnerLeftSpace),
        right: this.outterSpace.getBugsCount(spaceDirections.InnerRightSpace),
    }

    // console.log(outterBugs);

    let bugsAround = new Array(size).fill(null).map(a => new Array(size).fill(0));

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y += 3) {
            if (state[y+1][x])
                bugsAround[y][x]++
        }

        for (let y = 1; y < 3 ; y ++)
            if (state[y+1][x] && x != middlePoint)
                bugsAround[y][x]++

        for (let y = 1; y < size; y += 3) {
            if (state[y-1][x])
                bugsAround[y][x]++
        }

        for (let y = 2; y < 4 ; y ++)
            if (state[y-1][x] && x != middlePoint)
                bugsAround[y][x]++

        bugsAround[0][x] += outterBugs.upper;
        bugsAround[size - 1][x] += outterBugs.bottom;
    }

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x += 3) {
            if (state[y][x+1])
                bugsAround[y][x]++
        }

        for (let x = 1; x < 3 ; x ++)
            if (state[y][x+1] && y != middlePoint)
                bugsAround[y][x]++

        for (let x = 1; x < size; x += 3) {
            if (state[y][x-1])
                bugsAround[y][x]++
        }

        for (let x = 2; x < 4 ; x ++)
            if (state[y][x-1] && y != middlePoint)
                bugsAround[y][x]++

        bugsAround[y][0] += outterBugs.left;
        bugsAround[y][size - 1] += outterBugs.right;
    }

    bugsAround[1][2] += this.innerSpace.getBugsCount(spaceDirections.OutterUpperSpace);
    bugsAround[3][2] += this.innerSpace.getBugsCount(spaceDirections.OutterBottomSpace);
    bugsAround[2][1] += this.innerSpace.getBugsCount(spaceDirections.OutterLeftSpace);
    bugsAround[2][3] += this.innerSpace.getBugsCount(spaceDirections.OutterRightSpace);

    // console.log("BUGS AROUND\n", bugsAround, this.spaceId);

    for (let y = 0; y < state.length; y++) {
        for (let x = 0; x < state[0].length; x++) {
            if (y == middlePoint && x == middlePoint)
                continue;

            if (state[y][x]) {
                if (bugsAround[y][x] != 1)
                    newState[y][x] = false;
            } else {
                if (bugsAround[y][x] == 1 || bugsAround[y][x] == 2)
                    newState[y][x] = true;
            }
        }
    }

    if (this.spaceId >= 0)
        this.outterSpace.spendMinute();
    if (this.spaceId <= 0)
        this.innerSpace.spendMinute();

    this.state = newState;

    // console.log("spendMinute", this.spaceId);
}

console.log("Part One:", partOne(initialState));

let space = new Space(initialState);
for (let i = 0; i < 200; i++) {
    space.spendMinute();
}
console.log("Part Two:", space.countBugs());
