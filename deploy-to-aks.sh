#!/bin/bash

# AKS Deployment Script for IrtazaFoods
# Usage: ./deploy-to-aks.sh YOUR_DOCKERHUB_USERNAME

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker Hub username is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Docker Hub username required${NC}"
    echo "Usage: ./deploy-to-aks.sh YOUR_DOCKERHUB_USERNAME"
    exit 1
fi

DOCKER_USERNAME=$1
NAMESPACE="irtazafoods"

echo -e "${GREEN}Starting AKS deployment...${NC}"

# Step 1: Update deployment.yaml with Docker Hub username
echo -e "${YELLOW}Updating manifests with Docker Hub username...${NC}"
sed -i.bak "s/YOUR_DOCKERHUB_USERNAME/$DOCKER_USERNAME/g" k8s/deployment.yaml

# Step 2: Create namespace
echo -e "${YELLOW}Creating namespace...${NC}"
kubectl apply -f k8s/namespace.yaml

# Step 3: Create PVC
echo -e "${YELLOW}Creating PersistentVolumeClaim for MongoDB...${NC}"
kubectl apply -f k8s/pvc.yaml

# Step 4: Wait for PVC to be bound
echo -e "${YELLOW}Waiting for PVC to be bound...${NC}"
kubectl wait --for=condition=Bound pvc/mongo-pvc -n $NAMESPACE --timeout=60s

# Step 5: Deploy MongoDB
echo -e "${YELLOW}Deploying MongoDB...${NC}"
kubectl apply -f k8s/deployment.yaml

# Step 6: Deploy Services
echo -e "${YELLOW}Deploying Services...${NC}"
kubectl apply -f k8s/service.yaml

# Step 7: Wait for deployments to be ready
echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-db -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-backend -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-frontend -n $NAMESPACE

# Step 8: Get pod status
echo -e "${GREEN}Deployment Status:${NC}"
kubectl get pods -n $NAMESPACE

# Step 9: Get service status
echo -e "${GREEN}Service Status:${NC}"
kubectl get svc -n $NAMESPACE

# Step 10: Get external IP
echo -e "${YELLOW}Waiting for LoadBalancer IP...${NC}"
EXTERNAL_IP=""
for i in {1..30}; do
    EXTERNAL_IP=$(kubectl get svc -n $NAMESPACE irtazafoods-frontend -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$EXTERNAL_IP" ]; then
        break
    fi
    echo "Waiting for external IP... ($i/30)"
    sleep 10
done

if [ -n "$EXTERNAL_IP" ]; then
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}Frontend URL: http://$EXTERNAL_IP${NC}"
else
    echo -e "${YELLOW}External IP not yet assigned. Check with:${NC}"
    echo "kubectl get svc -n $NAMESPACE irtazafoods-frontend"
fi

# Restore backup
mv k8s/deployment.yaml.bak k8s/deployment.yaml 2>/dev/null || true

echo -e "${GREEN}Deployment complete!${NC}"

