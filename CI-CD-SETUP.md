# CI/CD Pipeline Setup Guide

## Overview
This project includes a complete CI/CD pipeline using GitHub Actions that automates:
1. **Build** - Frontend and Backend
2. **Test** - Automated testing
3. **Docker Build & Push** - Container images to Docker Hub
4. **Deploy** - Kubernetes deployment

## Prerequisites

### 1. GitHub Secrets Configuration
Add the following secrets to your GitHub repository:
- Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Required secrets:
- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_TOKEN`: Your Docker Hub access token (create at https://hub.docker.com/settings/security)

### 2. Docker Hub Setup
1. Create a Docker Hub account at https://hub.docker.com
2. Generate an access token:
   - Go to Account Settings → Security → New Access Token
   - Copy the token and add it as `DOCKER_HUB_TOKEN` secret

## Pipeline Stages

### Stage 1: Build
- Installs dependencies for frontend and backend
- Builds frontend (Vite production build)
- Verifies backend build

### Stage 2: Test
- Runs frontend tests (linting + test scripts)
- Runs backend tests
- All tests must pass before proceeding

### Stage 3: Docker Build & Push
- Builds Docker images for:
  - Frontend
  - Backend
  - MongoDB
- Pushes images to Docker Hub registry
- Tags images with branch name, SHA, and latest

### Stage 4: Deploy
- Deploys to Kubernetes cluster (staging environment)
- Applies Kubernetes manifests from `k8s/` directory
- Performs health checks

## Trigger Configuration

The pipeline runs automatically on:
- **Push** to `main`, `master`, or `develop` branches
- **Pull Requests** to `main`, `master`, or `develop` branches

## Kubernetes Deployment

### Manifests Location
All Kubernetes manifests are in the `k8s/` directory:
- `namespace.yaml` - Creates irtazafoods namespace
- `deployment.yaml` - Deploys frontend, backend, and MongoDB
- `service.yaml` - Exposes services
- `pvc.yaml` - Persistent volume for MongoDB data

### Deployment Steps
1. Create namespace
2. Create persistent volume claim
3. Deploy MongoDB
4. Deploy Backend
5. Deploy Frontend
6. Expose services
7. Health checks

## Viewing Pipeline Runs

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Select a workflow run to see detailed logs for each stage

## Manual Testing

To test the pipeline locally:

```bash
# Test frontend build
cd frontend
npm install
npm run build

# Test backend build
cd ../backend
npm install
npm start

# Run tests
cd ../frontend && npm test
cd ../backend && npm test
```

## Troubleshooting

### Pipeline fails at Docker login
- Verify `DOCKER_HUB_USERNAME` and `DOCKER_HUB_TOKEN` secrets are set correctly
- Check token has write permissions

### Tests fail
- Run tests locally: `npm test` in frontend/backend directories
- Check for linting errors: `npm run lint` in frontend

### Deployment fails
- Verify Kubernetes cluster is accessible
- Check kubectl configuration
- Ensure manifests in `k8s/` directory are valid

## Screenshot Requirements

For submission, capture screenshots showing:
1. All pipeline stages completed successfully
2. Docker images pushed to registry
3. Deployment status
4. Health checks passing

