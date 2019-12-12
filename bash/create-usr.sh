#!/bin/bash

# Author: Tom Green
# Date Created:	20/10/2019

cd /media/el-rat/USB/saves

if [ -z "$1" ]
then
	printf "No arguments provided.\n"
elif [ -d "$1" ]
then
	printf "User ${1} already exists.\n"
else
	mkdir $1
	printf "User ${1} successfully created!\n"
fi

exit
