#!/bin/bash

# Author: Tom Green
# Date Created: 02/02/2020

cd /media/el-rat/USB/saves

# Check if args[0] is initialised and whether the user has a directory.
# Otherwise change to the user's directory and delete their profile.
if [ -z "$1" ]
then
	printf "No arguments provided.\n"
elif [ ! -d "$1" ]
then
	printf "User ${1} doesn't exist.\n"
else
	cd $1
	rm profile.json
	printf "profile.json successfully removed!\n"
fi

exit