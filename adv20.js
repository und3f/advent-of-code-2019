#!/usr/bin/env node

const fs = require('fs');
let contents = fs.readFileSync("adv20.txt", 'utf8');

let map = contents.split("\n").map(a => a.split(""));
let directions = [
    [-1, 0],
    [ 0, 1],
    [ 1, 0],
    [ 0,-1]
];

let portalSeach = [
    [1, 0],
    [0, 1]
];

function isBorder(p, map) {
    let portalSize = 3;
    if (p[0] <= portalSize || p[0] >= map.length - portalSize - 1)
        return 1;

    if (p[1] <= portalSize || p[1] >= map[p[0]].length - portalSize - 1)
        return 1;
    return 0;
}

function findPortalPoints(map) {
    let center = [Math.round(map.length/2), Math.round(map[0].length/2)];

    let portals = [];
    for (let y = 0; y < map.length - 1; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let s = map[y][x];
            let s2;
            let y2, x2;
            if (s >= 'A' && s <= 'Z') {
                for (let i in portalSeach) {
                    s2 = map[y + portalSeach[i][0]][x + portalSeach[i][1]];
                    if (s2 >= 'A' && s2 <= 'Z') {
                        y2 = y + portalSeach[i][0];
                        x2 = x + portalSeach[i][1];
                        break;
                    }
                }
            }
            if (y2 == null)
                continue;
            
            let found = false;
            let portalName = s + s2;
            for (let ys = y > 0 ? y - 1 : 0; ys <= y2+1 && !found; ys++) {
                for (let xs = x > 0 ? x - 1 : 0; xs <= x2 + 1; xs++) {
                    if (map[ys][xs] == '.') {
                        if (portals[portalName] == null)
                            portals[portalName] = [];
                        portals[portalName].push([ys, xs])
                        found = true;
                        break;
                    }
                }
            }
        }
    }

    Object.values(portals).forEach(
        points => points.sort((b, a) => isBorder(a, map) - isBorder(b, map)));

    return portals;
}

function traceMap(_map) {
    let map = _map.map(a => a.slice());
    let portalPoints = findPortalPoints(map);
    let startPoint = portalPoints["AA"][0];
    let endPoint = portalPoints["ZZ"][0];
    endPointS = endPoint.join();
    delete portalPoints.AA;
    delete portalPoints.ZZ;

    let portals = {};

    Object.values(portalPoints).forEach(bindedPortals => {
        portals[bindedPortals[0]] = bindedPortals[1];
        portals[bindedPortals[1]] = bindedPortals[0];
    });

    let tracingPoints = [startPoint];

    let steps = 0;

    do {
        let nextTracingPoints = [];

        while (tracingPoints.length > 0) {
            let p = tracingPoints.shift();
            let y = p[0], x = p[1];

            map[y][x] = '#';
            if (endPointS == p)
                return steps;

            let portal = portals[p];
            if (portal) {
                nextTracingPoints.push(portal);
            }

            for (let i in directions) {
                let d = directions[i];
                let ny = y + d[0];
                let nx = x + d[1];
                if (ny > 0 && nx > 0 && ny < map.length && nx < map[ny].length && map[ny][nx] == '.')
                    nextTracingPoints.push([ny, nx]);
            }
        }

        tracingPoints = nextTracingPoints;
        steps++;
    } while (tracingPoints.length > 0);
}

function traceNdimentionalMap(_map) {
    let maps = [_map.map(a => a.slice())];

    let portalPoints = findPortalPoints(map);
    // console.log(portalPoints);
    let startPoint = portalPoints["AA"][0];
    let endPoint = portalPoints["ZZ"][0];
    endPointS = endPoint.join();
    delete portalPoints.AA;
    delete portalPoints.ZZ;

    let portals = {};

    Object.values(portalPoints).forEach(bindedPortals => {
        portals[bindedPortals[0]] = [-1, bindedPortals[1]];
        portals[bindedPortals[1]] = [+1, bindedPortals[0]];
    });
    // console.log(portals);

    let tracingPoints = [[0, ...startPoint]];

    let steps = 0;

    do {
        let nextTracingPoints = [];
        // console.log("STEP", steps, tracingPoints);

        while (tracingPoints.length > 0) {
            let lp = tracingPoints.shift();
            const p = lp.slice(1, 3);
            const level = lp[0];
            let y = lp[1], x = lp[2];


            if (maps[level] == null) {
                maps[level] = _map.map(a => a.slice());
            }

            maps[level][y][x] = '#';
            if (level == 0 && endPointS == p)
                return steps;

            let portal = portals[p];

            if (portal && level + portal[0] >= 0) {
                let nlevel = level + portal[0];
                if (maps[nlevel] == null || maps[nlevel][portal[1][0]][portal[1][1]] != '#') {
                    // console.log("Entering ", portal, "to level", level + portal[0], "POSITION", level, y, x);
                    nextTracingPoints.push([level + portal[0], ...portal[1]]);
                }
            }

            for (let i in directions) {
                let d = directions[i];
                let ny = y + d[0];
                let nx = x + d[1];
                if (ny > 0 && nx > 0 && ny < maps[level].length && nx < maps[level][ny].length && maps[level][ny][nx] == '.')
                    nextTracingPoints.push([level, ny, nx]);
            }
        }

        tracingPoints = nextTracingPoints;
        steps++;

        /*
        for (let i = 0; i < maps.length; i++) {
            console.log("LEVEL", i);
            console.log(maps[i].map(l => l.join("")).join("\n"));
        }
        */
    } while (tracingPoints.length > 0);

}

console.log("Part One:", traceMap(map));
console.log("Part Two:", traceNdimentionalMap(map));
