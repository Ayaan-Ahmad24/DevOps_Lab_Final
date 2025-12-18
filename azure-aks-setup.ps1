# Azure AKS Setup Script for IrtazaFoods (PowerShell)
# This script creates resource group, AKS cluster, and deploys the application

# ============================================
# CONFIGURATION - Update these variables
# ============================================
$RESOURCE_GROUP = "irtazafoods-rg"
$CLUSTER_NAME = "irtazafoods-aks"
$LOCATION = "southeastasia"  # Change to your preferred Azure region
$NODE_COUNT = 2
$NODE_VM_SIZE = "Standard_B2s"  # Minimum for testing, adjust as needed
$AKS_VERSION = ""  # Leave empty to use latest, or specify version like "1.28.0"

# ============================================
# STEP 1: Login to Azure (if not already logged in)
# ============================================
Write-Host "Step 1: Checking Azure login status..." -ForegroundColor Cyan
$account = az account show 2>$null
if (-not $account) {
    Write-Host "Please login to Azure..." -ForegroundColor Yellow
    az login
}

# Set the subscription (optional - uncomment and set if you have multiple subscriptions)
# az account set --subscription "YOUR_SUBSCRIPTION_ID"

# ============================================
# STEP 2: Create Resource Group
# ============================================
Write-Host "Step 2: Creating resource group '$RESOURCE_GROUP' in '$LOCATION'..." -ForegroundColor Cyan
az group create `
    --name $RESOURCE_GROUP `
    --location $LOCATION

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to create resource group" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Resource group created successfully" -ForegroundColor Green

# ============================================
# STEP 3: Create AKS Cluster
# ============================================
Write-Host "Step 3: Creating AKS cluster '$CLUSTER_NAME'..." -ForegroundColor Cyan
Write-Host "This may take 10-15 minutes..." -ForegroundColor Yellow

if ([string]::IsNullOrEmpty($AKS_VERSION)) {
    az aks create `
        --resource-group $RESOURCE_GROUP `
        --name $CLUSTER_NAME `
        --node-count $NODE_COUNT `
        --node-vm-size $NODE_VM_SIZE `
        --generate-ssh-keys `
        --location $LOCATION
}
else {
    az aks create `
        --resource-group $RESOURCE_GROUP `
        --name $CLUSTER_NAME `
        --node-count $NODE_COUNT `
        --node-vm-size $NODE_VM_SIZE `
        --kubernetes-version $AKS_VERSION `
        --generate-ssh-keys `
        --location $LOCATION
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to create AKS cluster" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] AKS cluster created successfully" -ForegroundColor Green

# ============================================
# STEP 4: Get AKS Credentials
# ============================================
Write-Host "Step 4: Getting AKS credentials..." -ForegroundColor Cyan
az aks get-credentials `
    --resource-group $RESOURCE_GROUP `
    --name $CLUSTER_NAME `
    --overwrite-existing

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to get AKS credentials" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] AKS credentials configured" -ForegroundColor Green

# ============================================
# STEP 5: Verify Cluster Connection
# ============================================
Write-Host "Step 5: Verifying cluster connection..." -ForegroundColor Cyan
kubectl cluster-info
kubectl get nodes

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to connect to cluster" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Cluster connection verified" -ForegroundColor Green

# ============================================
# STEP 6: Deploy Application
# ============================================
Write-Host "Step 6: Deploying application to AKS..." -ForegroundColor Cyan

# Apply namespace
Write-Host "Creating namespace..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml

# Apply PVC (Persistent Volume Claim for MongoDB)
Write-Host "Creating persistent volume claim..." -ForegroundColor Yellow
kubectl apply -f k8s/pvc.yaml

# Apply ConfigMap (if exists)
if (Test-Path "k8s/nginx-configmap.yaml") {
    Write-Host "Creating nginx configmap..." -ForegroundColor Yellow
    kubectl apply -f k8s/nginx-configmap.yaml
}

# Apply deployments
Write-Host "Creating deployments..." -ForegroundColor Yellow
kubectl apply -f k8s/deployment.yaml

# Apply services
Write-Host "Creating services..." -ForegroundColor Yellow
kubectl apply -f k8s/service.yaml

Write-Host "[OK] Application deployment initiated" -ForegroundColor Green

# ============================================
# STEP 7: Wait for Pods to be Ready
# ============================================
Write-Host "Step 7: Waiting for pods to be ready..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

kubectl wait --for=condition=ready pod --all -n irtazafoods --timeout=300s

# ============================================
# STEP 8: Display Deployment Status
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT STATUS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pods:" -ForegroundColor Yellow
kubectl get pods -n irtazafoods
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
kubectl get svc -n irtazafoods
Write-Host ""
Write-Host "Deployments:" -ForegroundColor Yellow
kubectl get deployments -n irtazafoods
Write-Host ""

# ============================================
# STEP 9: Get Public IP Address
# ============================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "PUBLIC IP ADDRESS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Waiting for LoadBalancer to assign external IP..." -ForegroundColor Yellow
Write-Host "This may take 2-5 minutes..." -ForegroundColor Yellow

# Wait for external IP to be assigned
$EXTERNAL_IP = ""
$MAX_ATTEMPTS = 30
$ATTEMPT = 0

while ([string]::IsNullOrEmpty($EXTERNAL_IP) -and $ATTEMPT -lt $MAX_ATTEMPTS) {
    $EXTERNAL_IP = kubectl get svc irtazafoods-frontend -n irtazafoods -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    if ([string]::IsNullOrEmpty($EXTERNAL_IP)) {
        Write-Host "Waiting for external IP... (attempt $($ATTEMPT+1)/$MAX_ATTEMPTS)" -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $ATTEMPT++
    }
}

if (-not [string]::IsNullOrEmpty($EXTERNAL_IP)) {
    Write-Host ""
    Write-Host "[OK] Application is accessible at: http://$EXTERNAL_IP" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now access your application using the above URL" -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "[WARNING] External IP is still being assigned. Check status with:" -ForegroundColor Yellow
    Write-Host "   kubectl get svc irtazafoods-frontend -n irtazafoods" -ForegroundColor White
    Write-Host ""
    Write-Host "Once assigned, get the IP with:" -ForegroundColor Yellow
    Write-Host "   kubectl get svc irtazafoods-frontend -n irtazafoods -o jsonpath='{.status.loadBalancer.ingress[0].ip}'" -ForegroundColor White
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "USEFUL COMMANDS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "View pods:              kubectl get pods -n irtazafoods" -ForegroundColor White
Write-Host "View services:          kubectl get svc -n irtazafoods" -ForegroundColor White
Write-Host "View logs (frontend):   kubectl logs -f deployment/irtazafoods-frontend -n irtazafoods" -ForegroundColor White
Write-Host "View logs (backend):    kubectl logs -f deployment/irtazafoods-backend -n irtazafoods" -ForegroundColor White
Write-Host "View logs (database):   kubectl logs -f deployment/irtazafoods-db -n irtazafoods" -ForegroundColor White
Write-Host "Get public IP:          kubectl get svc irtazafoods-frontend -n irtazafoods" -ForegroundColor White
Write-Host "Delete cluster:         az aks delete --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --yes" -ForegroundColor White
Write-Host ""

Write-Host "[OK] Setup complete!" -ForegroundColor Green

