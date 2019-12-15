#!/usr/bin/env node

const fs = require('fs');
const IntcodeComputer = require('./intcode-computer');

let contents = fs.readFileSync("adv13.txt", 'utf8').trim();

let originalIntcode = contents.split(",").map(a => parseInt(a));
originalIntcode[0] = 2;

let blocks = 0;

function Arcade() {
    this.ballPosition = null;
    this.paddlePosition = null;
    this.score = null;
    this.screen = new Array;
    this.wallSymbol = "░";
}

Arcade.prototype.isBallAtTheWall = function() {
    if (this.ballPosition[1] == 1)
        return -1;

    if (this.screen[1][this.ballPosition[1]+1] == this.wallSymbol)
        return 1;

    return null;
}

Arcade.prototype.input = function (out) {
    let screen = this.screen;
    for (let i = 0; i < out.length; i+=3) {
        let x = out[i];
        let y = out[i+1];
        let id = out[i+2];
        if (x == -1 && y == 0) {
            this.score = id;
            continue;
        }
            
        if (screen[y] == null)
            screen[y] = new Array;
        if (id == 2)
            blocks++;

        let symbol = " ";
        switch(id) {
            case 1:
                symbol = this.wallSymbol;
                break;
            case 2:
                symbol = "#";
                break;

            case 3:
                this.paddlePosition = [y, x];
                symbol = "=";
                break;

            case 4:
                let b = this.ballPosition;
                this.ballPosition = [y, x];
                symbol = "○";
                break;
        }
        screen[y][x] = symbol;
    }

}

Arcade.prototype.display = function() {
    return this.screen.map(a => a.join("")).join("\n");
}

let out = [];
let arcade = new Arcade();

let ballPrevious = [];
let inputCb = function() {
    arcade.input(out);
    out.length = 0;

    let ballX = arcade.ballPosition[1];
    let paddleX = arcade.paddlePosition[1];

    if (ballPrevious.length == 0)
        ballPrevious.unshift(ballX - 1);

    if (ballPrevious[0] == ballX)
        ballPrevious.shift();

    let velocity = ballX - ballPrevious[0];
    let change = Math.sign(velocity);

    let distanceToBall = Math.abs(ballX - paddleX);

    if ((ballX + velocity - paddleX) * change < 1 )
        change = 0;

    if (ballX == paddleX && arcade.ballPosition[0] + 1 == arcade.paddlePosition[0])
        change = 0;

    let atTheWall = arcade.isBallAtTheWall();
    if (atTheWall && distanceToBall > 2)
        change = -1 * atTheWall;

    ballPrevious.unshift(ballX);
    ballPrevious = ballPrevious.slice(0, 2);

    // Uncomment if you would like to show all the boards
    // console.log(arcade.display());

    return change;
};

new IntcodeComputer(originalIntcode, inputCb, v => out.push(v)).start()
inputCb();

console.log("Part One:", blocks);

console.log("Part Two:", arcade.score);

