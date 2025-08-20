# PR Preview Setup

This repository includes automated PR preview functionality to build and preview the blog site for pull requests targeting the `main` branch.

## Current Setup

**Active**: GitHub Artifacts workflow (`.github/workflows/pr-preview-github.yml`)
**Available**: Netlify workflow (`.github/workflows/pr-preview-netlify.yml.disabled`)

## Available Options

### Option 1: GitHub Artifacts (Currently Active)

**File**: `.github/workflows/pr-preview-github.yml`

This workflow creates downloadable artifacts containing the built site.

**Setup Requirements**: None (uses built-in GitHub features)

**Benefits**:
- No external dependencies
- Works immediately without additional setup
- Uses only GitHub's native features
- Already enabled and ready to use

**Usage**:
1. Create a PR to `main` branch
2. Wait for the workflow to complete
3. Go to the Actions tab for the PR build
4. Download the `pr-preview-{PR_NUMBER}` artifact
5. Extract and serve locally:
   ```bash
   npx serve extracted-folder
   ```

### Option 2: Netlify Preview

**File**: `.github/workflows/pr-preview-netlify.yml.disabled`

This workflow deploys PR previews to Netlify, providing direct preview URLs.

**Setup Requirements**:
1. Create a Netlify account and site
2. Add the following repository secrets:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: Your Netlify site ID

**Benefits**:
- Direct preview URLs automatically posted to PR comments
- No manual download/setup required
- Netlify's excellent preview infrastructure

**To enable**:
1. Set up the required Netlify secrets
2. Rename `pr-preview-netlify.yml.disabled` to `pr-preview-netlify.yml`
3. Disable the GitHub artifacts workflow:
   ```bash
   mv .github/workflows/pr-preview-github.yml .github/workflows/pr-preview-github.yml.disabled
   ```

## How It Works

Both workflows:
1. Trigger on PR open, update, or reopen events
2. Build the site using `PREVIEW_BUILD=true` (removes GitHub Pages base path)
3. Either deploy to Netlify or create a downloadable artifact
4. Comment on the PR with preview information

## Technical Details

The preview builds differ from production builds:
- **Production**: Uses `/trustyai-blog` base path for GitHub Pages
- **Preview**: Uses root path (`/`) for better compatibility with preview services

This is controlled by the `PREVIEW_BUILD` environment variable in `astro.config.mjs`.

## Choosing a Workflow

**Use Netlify** if:
- You want the smoothest experience with direct links
- You're comfortable setting up external service integration
- Your team frequently reviews PR previews

**Use GitHub Artifacts** if:
- You prefer no external dependencies
- You only occasionally need previews
- You want immediate setup without configuration