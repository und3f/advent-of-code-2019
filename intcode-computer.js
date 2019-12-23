"use strict";

module.exports = IntcodeComputer;

function IntcodeComputer(intcode, cbInput, cbOutput) {
    this.intcode = intcode.slice();

    this.position = 0;
    this.relativeBase = 0;

    this.cbInput = cbInput;
    this.cbOutput = cbOutput
    this.stop = false;
}

IntcodeComputer.prototype.executeNextInstruction = function () {
    let intcode = this.intcode;
    let instruction = intcode[this.position];
    let instructionString = instruction.toString().split('').reverse();

    let opcode = instruction % 100;

    let a1, a2, result;

    let that = this;
    let getParameter = function(parameter) {
        let mode = instructionString[parameter + 1];
        let p = intcode[that.position + parameter];
        if (!mode || mode == 0)
            p = intcode[p] || 0
        else if (mode == 2) {
            p = intcode[that.relativeBase + p];
        }
        return p;
    }

    let setParameter = function(parameter, value) {
        let mode = instructionString[parameter + 1];
        let p = intcode[that.position + parameter];
        if (!mode || mode == 0)
            intcode[p] = value
        else if (mode == 2)
            intcode[that.relativeBase + p] = value;
    }

    switch (opcode) {
        case 99:
            this.position = -1;
            return -1;
        case 1:
        case 2:
        case 7:
        case 8:
            a1 = getParameter(1);
            a2 = getParameter(2);

            result = 0;
            switch (opcode) {
                case 1:
                    result = a1 + a2
                    break;
                case 2:
                    result = a1 * a2;
                    break;
                case 7:
                    if (a1 < a2)
                        result = 1
                    break;
                case 8:
                    if (a1 == a2)
                        result = 1;
                    break;
            }

            setParameter(3, result);
            this.position += 4;
            break;
        case 3:
        case 4:

            if (opcode == 3) {
                setParameter(1, this.cbInput());
            }
            else if (opcode == 4){
                a1 = getParameter(1)
                this.cbOutput(a1);
            }

            this.position += 2;
            break;

        case 5:
            a1 = getParameter(1);
            a2 = getParameter(2);

            if (a1 != 0)
                this.position = a2;
            else
                this.position += 3;
            break;

        case 6:
            a1 = getParameter(1);
            a2 = getParameter(2);

            if (a1 == 0)
                this.position = a2;
            else
                this.position += 3;
            break;

        case 9:
            a1 = getParameter(1);
            this.relativeBase += a1;
            this.position += 2;
            break;

        default:
            throw "Unknown opcode at position " + this.position + ": " + opcode;
    }

    return this.position;
}

IntcodeComputer.prototype.pause = function() {
    this.stop = true;
}

IntcodeComputer.prototype.start = function() {
    this.stop = false;
    while (this.position != -1 && !this.stop) {
        this.executeNextInstruction();
    }
    return;
}
