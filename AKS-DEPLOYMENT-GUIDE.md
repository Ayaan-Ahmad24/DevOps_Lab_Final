# Azure Kubernetes Service (AKS) Deployment Guide

## Overview
This guide will help you deploy your 3-tier application (Frontend, Backend, MongoDB) to Azure Kubernetes Service (AKS).

## Prerequisites

1. **Azure Account** with active subscription
2. **Azure CLI** installed ([Download here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
3. **kubectl** installed ([Download here](https://kubernetes.io/docs/tasks/tools/))
4. **Docker Hub** images pushed (from CI/CD pipeline)
5. **Docker Hub credentials** for pulling images

---

## Task C1: Create AKS Cluster and Deploy Application

### Step 1: Install Azure CLI (if not installed)

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
```

**Verify installation:**
```bash
az --version
```

### Step 2: Login to Azure

```bash
az login
```

This will open a browser window for authentication.

### Step 3: Set Azure Subscription (if you have multiple)

```bash
# List all subscriptions
az account list --output table

# Set active subscription (replace with your subscription ID)
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### Step 4: Create Resource Group

```bash
# Set variables
RESOURCE_GROUP="irtazafoods-rg"
LOCATION="eastus"  # Change to your preferred region

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION
```

### Step 5: Create AKS Cluster

```bash
# Set cluster variables
CLUSTER_NAME="irtazafoods-aks"
NODE_COUNT=2
NODE_VM_SIZE="Standard_B2s"  # Minimum for testing (2 vCPU, 4GB RAM)

# Create AKS cluster (this takes 10-15 minutes)
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --node-count $NODE_COUNT \
  --node-vm-size $NODE_VM_SIZE \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials to connect kubectl to your cluster
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
```

### Step 6: Verify Cluster Connection

```bash
# Verify kubectl is connected
kubectl get nodes

# You should see your nodes in Ready state
```

### Step 7: Update Kubernetes Manifests with Your Docker Hub Username

Before deploying, you need to replace `$DOCKER_HUB_USERNAME` in the manifests with your actual Docker Hub username.

**Option A: Use sed/Find-Replace**
```bash
# Replace YOUR_DOCKERHUB_USERNAME with your actual username
DOCKER_USERNAME="YOUR_DOCKERHUB_USERNAME"

# Update deployment.yaml
sed -i "s/\$DOCKER_HUB_USERNAME/$DOCKER_USERNAME/g" k8s/deployment.yaml
```

**Option B: Manual Edit**
Edit `k8s/deployment.yaml` and replace:
- `docker.io/$DOCKER_HUB_USERNAME/irtazafoods-frontend:latest`
- `docker.io/$DOCKER_HUB_USERNAME/irtazafoods-backend:latest`
- `docker.io/$DOCKER_HUB_USERNAME/irtazafoods-mongo-db:latest`

With your actual Docker Hub username, e.g.:
- `docker.io/ayaanahmad24/irtazafoods-frontend:latest`

### Step 8: Create Image Pull Secret (if images are private)

If your Docker Hub images are private, create a secret:

```bash
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=YOUR_DOCKERHUB_USERNAME \
  --docker-password=YOUR_DOCKERHUB_TOKEN \
  --docker-email=YOUR_EMAIL \
  --namespace=irtazafoods
```

Then add to deployments (see updated deployment.yaml).

### Step 9: Deploy Application to AKS

```bash
# Navigate to project root
cd E:\2025\sem\ 7\devops\IrtazaFoods

# Apply all manifests in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Step 10: Wait for Pods to be Ready

```bash
# Watch pods until all are Running
kubectl get pods -n irtazafoods -w

# Or check status
kubectl get pods -n irtazafoods
```

### Step 11: Get Public IP Address

```bash
# Get the LoadBalancer external IP (this may take a few minutes)
kubectl get svc -n irtazafoods irtazafoods-frontend

# Watch until EXTERNAL-IP is assigned
kubectl get svc -n irtazafoods irtazafoods-frontend -w
```

The `EXTERNAL-IP` will be your public URL (e.g., `http://20.xxx.xxx.xxx`).

---

## Task C2: AKS Deployment Verification

### Verification Commands

#### 1. Check All Pods are Running

```bash
kubectl get pods -n irtazafoods
```

**Expected Output:**
```
NAME                                  READY   STATUS    RESTARTS   AGE
irtazafoods-backend-xxxxx-xxxxx       1/1     Running   0          2m
irtazafoods-backend-xxxxx-xxxxx       1/1     Running   0          2m
irtazafoods-db-xxxxx-xxxxx            1/1     Running   0          2m
irtazafoods-frontend-xxxxx-xxxxx      1/1     Running   0          2m
irtazafoods-frontend-xxxxx-xxxxx      1/1     Running   0          2m
```

**Screenshot:** `kubectl get pods -n irtazafoods`

#### 2. Check Services Created Successfully

```bash
kubectl get svc -n irtazafoods
```

**Expected Output:**
```
NAME                  TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
irtazafoods-backend   ClusterIP      10.0.xxx.xxx   <none>          5000/TCP       2m
irtazafoods-db        ClusterIP      10.0.xxx.xxx   <none>          27017/TCP      2m
irtazafoods-frontend  LoadBalancer   10.0.xxx.xxx   20.xxx.xxx.xxx  80:xxxxx/TCP   2m
```

**Screenshot:** `kubectl get svc -n irtazafoods`

#### 3. Verify Frontend Connecting to Backend

```bash
# Check frontend pod logs
kubectl logs -n irtazafoods -l app=irtazafoods-frontend --tail=50

# Test frontend can reach backend
kubectl exec -n irtazafoods -it $(kubectl get pod -n irtazafoods -l app=irtazafoods-frontend -o jsonpath='{.items[0].metadata.name}') -- curl http://irtazafoods-backend:5000/api/menu/get
```

#### 4. Verify Backend Connecting to Database

```bash
# Check backend pod logs
kubectl logs -n irtazafoods -l app=irtazafoods-backend --tail=50

# Look for: "Mongoose connected to the database" or "Database connected successfully"

# Test backend can reach MongoDB
kubectl exec -n irtazafoods -it $(kubectl get pod -n irtazafoods -l app=irtazafoods-backend -o jsonpath='{.items[0].metadata.name}') -- ping irtazafoods-db
```

#### 5. Access Running Application

```bash
# Get the public IP
EXTERNAL_IP=$(kubectl get svc -n irtazafoods irtazafoods-frontend -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Frontend URL: http://$EXTERNAL_IP"

# Open in browser
start http://$EXTERNAL_IP  # Windows
# or
open http://$EXTERNAL_IP    # Mac
```

**Screenshot:** Browser showing your running application at the public IP.

---

## Additional Verification Commands

### Check Deployment Status

```bash
kubectl get deployments -n irtazafoods
```

### Check Pod Details

```bash
kubectl describe pod -n irtazafoods <pod-name>
```

### Check Service Details

```bash
kubectl describe svc -n irtazafoods irtazafoods-frontend
```

### View All Resources

```bash
kubectl get all -n irtazafoods
```

---

## Troubleshooting

### Pods Not Starting

```bash
# Check pod events
kubectl describe pod -n irtazafoods <pod-name>

# Check pod logs
kubectl logs -n irtazafoods <pod-name>
```

### Image Pull Errors

- Verify Docker Hub images exist and are public (or add imagePullSecrets)
- Check image names in deployment.yaml match your Docker Hub repository

### External IP Pending

- Wait 5-10 minutes for Azure LoadBalancer to provision
- Check: `kubectl describe svc -n irtazafoods irtazafoods-frontend`

### Backend Can't Connect to Database

- Verify MongoDB service name: `irtazafoods-db`
- Check MONGO_URI in backend deployment: `mongodb://irtazafoods-db:27017/irtazafoods`
- Check MongoDB pod logs: `kubectl logs -n irtazafoods -l app=irtazafoods-db`

---

## Cleanup (After Submission)

To avoid Azure charges, delete the cluster:

```bash
az aks delete --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --yes
az group delete --name $RESOURCE_GROUP --yes
```

---

## Submission Checklist

- [ ] Screenshot: `kubectl get pods -n irtazafoods` (all pods Running)
- [ ] Screenshot: `kubectl get svc -n irtazafoods` (services with External IP)
- [ ] Screenshot: Running application in browser (public IP)
- [ ] Screenshot: Backend logs showing database connection
- [ ] Screenshot: Frontend logs showing backend connection

