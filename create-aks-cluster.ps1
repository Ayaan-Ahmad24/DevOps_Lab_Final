# AKS Cluster Creation Script for Southeast Asia
# Run these commands in PowerShell

# Step 1: Set variables
$RESOURCE_GROUP = "irtazafoods-rg"
$CLUSTER_NAME = "irtazafoods-aks"
$LOCATION = "southeastasia"
$NODE_COUNT = 2
$NODE_VM_SIZE = "Standard_B2s"

# Step 2: Create Resource Group
Write-Host "Creating resource group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION

# Step 3: Create AKS Cluster (takes 10-15 minutes)
Write-Host "Creating AKS cluster (this will take 10-15 minutes)..." -ForegroundColor Yellow
az aks create `
    --resource-group $RESOURCE_GROUP `
    --name $CLUSTER_NAME `
    --location $LOCATION `
    --node-count $NODE_COUNT `
    --node-vm-size $NODE_VM_SIZE `
    --generate-ssh-keys

# Step 4: Get cluster credentials
Write-Host "Getting cluster credentials..." -ForegroundColor Yellow
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME

# Step 5: Verify connection
Write-Host "Verifying cluster connection..." -ForegroundColor Yellow
kubectl get nodes

Write-Host ""
Write-Host "AKS cluster created successfully!" -ForegroundColor Green
Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor Cyan
Write-Host "Cluster Name: $CLUSTER_NAME" -ForegroundColor Cyan
Write-Host "Location: $LOCATION" -ForegroundColor Cyan
