#!/bin/bash

# Duplicates the current repository to a new location without copying the
# existing Git history. This allows you to experiment without altering the
# primary site.
#
# Usage: ./scripts/duplicate_repo.sh /path/to/new/directory

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <destination-directory>" >&2
  exit 1
fi

DEST="$1"

# Ensure destination does not already exist
if [ -e "$DEST" ]; then
  echo "Destination '$DEST' already exists." >&2
  exit 1
fi

# Copy all files except the .git folder and node_modules
rsync -av --exclude='.git' --exclude='node_modules' --exclude='.env*' ./ "$DEST"

# Initialize a new Git repository in the destination
cd "$DEST"
 git init >/dev/null

echo "Duplicate repository created at: $DEST"
echo "You can now modify files there and set up a new remote if desired."

