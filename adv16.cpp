#include <iostream>
#include <vector>
#include <fstream>
#include <cstdlib>
#include <cstring>

using namespace std;

unsigned char calculateElement(int signalLength, const unsigned char *signal, int elementNumber) {
    int patternFactor =  elementNumber;

    int sum = 0;

    for (int k = patternFactor - 1; k < signalLength; k += patternFactor * 4) {
        for (int l = 0; l < patternFactor && k + l < signalLength; l ++) {
            sum += signal[k+l];
        }
    }

    for (int k = patternFactor * 3 - 1; k < signalLength; k += patternFactor * 4) {
        for (int l = 0; l < patternFactor && k + l < signalLength; l ++) {
            sum -= signal[k+l];
        }
    }

    return abs(sum) % 10;
}

void calculateSignalPhase(int signalLength, const unsigned char *signal, unsigned char *newSignal, int offset = 0) {
    for (int i = offset; i < signalLength; i++) {
        newSignal[i] = calculateElement(signalLength, signal, i + 1);
    }
}

void calculateNPhases(int signalLength, const unsigned char *signal, int n, unsigned char *newSignal, int offset = 0) {
    unsigned char *buff1 = new unsigned char[signalLength];
    unsigned char *buff2 = new unsigned char[signalLength];
    unsigned char * const buffs[2] = {
        buff1, buff2
    };

    int inputP = 0;
    memcpy(buffs[inputP], signal, sizeof(signal[0]) * signalLength);
    for (int i = 1; i <= n; i++) {
        cout << i << endl;
        calculateSignalPhase(signalLength, buffs[inputP], buffs[(inputP+1)%2], offset);
        inputP = (inputP + 1) % 2;
    }

    memcpy(newSignal, buffs[inputP], sizeof(signal[0]) * signalLength);
}

void printSignal(const unsigned char *signal, const int offset = 0) {
    for (int i = 0; i < 8; i++)
        cout << (int)signal[i + offset];
    cout<<endl;
}

const int RealSignalMultiplier = 10000;
int main() {
    ifstream inputfile("adv16.txt");
    string line;

    string initial;

    int signalLength, realSignalLength;
    unsigned char *signal;
    unsigned char *realSignal;

    if (inputfile.is_open()) {
        getline(inputfile, line);
        signalLength = line.length();
        signal = new unsigned char [signalLength];
        realSignal = new unsigned char [signalLength * RealSignalMultiplier];
        for (int i = 0; i < line.length(); i++)
            signal[i] = line[i] - '0';
    }

    for (int j = 0; j < RealSignalMultiplier; j++)
        memcpy(realSignal + j * signalLength, signal, sizeof(signal[0]) * signalLength);

    unsigned char *hundredSignal = new unsigned char [signalLength];
    calculateNPhases(signalLength, signal, 100, hundredSignal);
    printSignal(hundredSignal);

    int messageOffset = 0;
    for (int i = 0; i < 7; i++)
        messageOffset = messageOffset * 10 + (int)signal[i];

    cout << "Message offset: " << messageOffset << endl;
    unsigned char *hundredRealSignal = new unsigned char [signalLength * RealSignalMultiplier];
    calculateNPhases(signalLength * RealSignalMultiplier, realSignal, 100, hundredRealSignal, messageOffset); 
    printSignal(hundredRealSignal, messageOffset);
}
