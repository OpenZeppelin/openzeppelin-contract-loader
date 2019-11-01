#!/bin/bash

for dir in */
do
  bash -x ./run-test.sh ${dir%*/}
done
