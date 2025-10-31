#!/bin/bash

# Email Privacy Rewrite Script for Hypernode-Sol Repositories
# This script rewrites git history to replace personal emails with GitHub noreply email

set -e

GITHUB_EMAIL="hypernode-sol@users.noreply.github.com"
AUTHOR_NAME="Hypernode Developer"

echo "========================================="
echo "Hypernode Email Privacy Rewrite Script"
echo "========================================="
echo ""
echo "This will rewrite git history in 3 repositories:"
echo "  - Network-and-Communication-Infrastructure"
echo "  - Hypernode-LoadBalancer"
echo "  - Hypernode-Dashboard"
echo ""
echo "Old emails will be replaced with: $GITHUB_EMAIL"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

# Function to rewrite repository
rewrite_repo() {
    local repo_name=$1
    local repo_url=$2

    echo ""
    echo "========================================="
    echo "Processing: $repo_name"
    echo "========================================="

    # Clone if not exists
    if [ ! -d "$repo_name" ]; then
        echo "Cloning $repo_name..."
        git clone "$repo_url" "$repo_name"
    fi

    cd "$repo_name"

    echo "Rewriting git history..."
    git filter-branch -f --env-filter '
    if [ "$GIT_COMMITTER_EMAIL" = "daniel.miguelmi11@gmail.com" ] ||
       [ "$GIT_COMMITTER_EMAIL" = "danielmiguel615@gmail.com" ] ||
       [ "$GIT_COMMITTER_EMAIL" = "noreply@anthropic.com" ]; then
        export GIT_COMMITTER_NAME="'"$AUTHOR_NAME"'"
        export GIT_COMMITTER_EMAIL="'"$GITHUB_EMAIL"'"
    fi
    if [ "$GIT_AUTHOR_EMAIL" = "daniel.miguelmi11@gmail.com" ] ||
       [ "$GIT_AUTHOR_EMAIL" = "danielmiguel615@gmail.com" ] ||
       [ "$GIT_AUTHOR_EMAIL" = "noreply@anthropic.com" ]; then
        export GIT_AUTHOR_NAME="'"$AUTHOR_NAME"'"
        export GIT_AUTHOR_EMAIL="'"$GITHUB_EMAIL"'"
    fi
    ' -- --all 2>&1 | grep -v "^Rewrite" || true

    echo "Cleaning up backup references..."
    rm -rf .git/refs/original/
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive --quiet

    echo "✓ $repo_name completed"

    cd ..
}

# Rewrite all repositories
rewrite_repo "Network-and-Communication-Infrastructure" \
    "https://github.com/hypernode-sol/Network-and-Communication-Infrastructure.git"

rewrite_repo "Hypernode-LoadBalancer" \
    "https://github.com/hypernode-sol/Hypernode-LoadBalancer.git"

rewrite_repo "Hypernode-Dashboard" \
    "https://github.com/hypernode-sol/Hypernode-Dashboard.git"

echo ""
echo "========================================="
echo "✓ All repositories processed!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Review changes in each repository:"
echo "   cd Network-and-Communication-Infrastructure && git log --format='%an <%ae> - %s'"
echo ""
echo "2. Push to GitHub (FORCE PUSH required):"
echo "   cd Network-and-Communication-Infrastructure && git push --force origin main"
echo "   cd ../Hypernode-LoadBalancer && git push --force origin main"
echo "   cd ../Hypernode-Dashboard && git push --force origin main"
echo ""
echo "3. Configure GitHub email privacy:"
echo "   Go to: Settings → Emails"
echo "   Check: 'Keep my email addresses private'"
echo "   Check: 'Block command line pushes that expose my email'"
echo ""
echo "⚠️  WARNING: Force push will rewrite history on GitHub!"
echo "    Anyone who cloned these repos will need to re-clone."
echo ""
