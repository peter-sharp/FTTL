#!/bin/bash
pico2wave -l="$1" -w=./test.wav "$2"
aplay ./test.wav
rm ./test.wav
