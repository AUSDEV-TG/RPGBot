#!/bin/bash

# Author: Tom Green
# Date Created:	20/10/2019

cd /media/el-rat/USB/saves

# Check if args[0] is initialised and whether the user has a directory.
# Otherwise change to the user's directory and delete their save.
if [ -z "$1" ]
then
	printf "No arguments provided.\n"
elif [ ! -d "$1" ]
then
	printf "User ${1} doesn't exist.\n"
else
	cd $1
	rm character.json
	printf "character.json successfully removed!\n"
fi

exit