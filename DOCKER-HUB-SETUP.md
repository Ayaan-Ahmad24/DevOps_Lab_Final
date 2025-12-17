# Docker Hub Setup Guide

## Issue: "access token has insufficient scopes"

This error occurs when your Docker Hub access token doesn't have **write permissions**. Follow these steps to create a token with the correct permissions.

## Step-by-Step Instructions

### 1. Create Docker Hub Account (if you don't have one)
- Go to https://hub.docker.com
- Sign up for a free account

### 2. Create Access Token with Write Permissions

1. **Log in to Docker Hub**
   - Go to https://hub.docker.com
   - Click on your username (top right) → **Account Settings**

2. **Navigate to Security**
   - Click on **Security** in the left sidebar
   - You'll see the "New Access Token" section

3. **Create New Access Token**
   - Click **New Access Token** button
   - **Access description**: Enter a name like "GitHub Actions CI/CD"
   - **Permissions**: Select **Read, Write & Delete** (or at minimum **Read & Write**)
   - Click **Generate**

4. **Copy the Token**
   - ⚠️ **IMPORTANT**: Copy the token immediately - you won't be able to see it again!
   - It will look like: `dckr_pat_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/Ayaan-Ahmad24/DevOps_Lab_Final
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

   **Secret 1:**
   - Name: `DOCKER_HUB_USERNAME`
   - Value: Your Docker Hub username (not email)

   **Secret 2:**
   - Name: `DOCKER_HUB_TOKEN`
   - Value: The access token you just created (starts with `dckr_pat_...`)

### 4. Verify Token Permissions

Your token must have:
- ✅ **Read** permission (to pull images)
- ✅ **Write** permission (to push images)
- ✅ **Delete** permission (optional, but recommended for cache management)

### 5. Re-run the Pipeline

After adding the secrets:
1. Go to **Actions** tab in your GitHub repository
2. Find the failed workflow run
3. Click **Re-run all jobs**

Or make a new commit to trigger a fresh run:
```bash
git commit --allow-empty -m "Trigger CI/CD pipeline"
git push origin main
```

## Troubleshooting

### Error: "401 Unauthorized"
- Check that `DOCKER_HUB_USERNAME` is your username (not email)
- Verify the token is correct (starts with `dckr_pat_`)
- Ensure token has **Write** permissions

### Error: "access token has insufficient scopes"
- Delete the old token
- Create a new token with **Read, Write & Delete** permissions
- Update the `DOCKER_HUB_TOKEN` secret in GitHub

### Token Not Working?
- Tokens expire or can be revoked
- Create a new token if the old one doesn't work
- Make sure you're using the latest token in GitHub secrets

## Alternative: Skip Docker Push (For Testing)

If you just want to test the pipeline without Docker Hub, you can modify the workflow to only build (not push) images. However, for the assignment, you should set up Docker Hub properly.

