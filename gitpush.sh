#!/bin/bash

# Usage:
#   ./gitpush.sh "Your commit message"
#
# If no message is given, it defaults to "update"

MESSAGE=${1:-"update"}

# Add all changes
git add .

# Commit
git commit -m "$MESSAGE"

# Push to origin (master by default, change if your branch is main)
git push origin master
