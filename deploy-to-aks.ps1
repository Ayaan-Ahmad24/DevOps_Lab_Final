# AKS Deployment Script for IrtazaFoods (PowerShell)
# Usage: .\deploy-to-aks.ps1 YOUR_DOCKERHUB_USERNAME

param(
    [Parameter(Mandatory=$true)]
    [string]$DockerUsername
)

$ErrorActionPreference = "Stop"
$NAMESPACE = "irtazafoods"

Write-Host "Starting AKS deployment..." -ForegroundColor Green

# Step 1: Update deployment.yaml with Docker Hub username
Write-Host "Updating manifests with Docker Hub username..." -ForegroundColor Yellow
$deploymentFile = "k8s\deployment.yaml"
$content = Get-Content $deploymentFile -Raw
$content = $content -replace "YOUR_DOCKERHUB_USERNAME", $DockerUsername
Set-Content -Path $deploymentFile -Value $content

# Step 2: Create namespace
Write-Host "Creating namespace..." -ForegroundColor Yellow
kubectl apply -f k8s\namespace.yaml

# Step 3: Create PVC
Write-Host "Creating PersistentVolumeClaim for MongoDB..." -ForegroundColor Yellow
kubectl apply -f k8s\pvc.yaml

# Step 4: Wait for PVC to be bound
Write-Host "Waiting for PVC to be bound..." -ForegroundColor Yellow
kubectl wait --for=condition=Bound pvc/mongo-pvc -n $NAMESPACE --timeout=60s

# Step 5: Deploy MongoDB, Backend, and Frontend
Write-Host "Deploying applications..." -ForegroundColor Yellow
kubectl apply -f k8s\deployment.yaml

# Step 6: Deploy Services
Write-Host "Deploying Services..." -ForegroundColor Yellow
kubectl apply -f k8s\service.yaml

# Step 7: Wait for deployments to be ready
Write-Host "Waiting for deployments to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-db -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-backend -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-frontend -n $NAMESPACE

# Step 8: Get pod status
Write-Host "`nDeployment Status:" -ForegroundColor Green
kubectl get pods -n $NAMESPACE

# Step 9: Get service status
Write-Host "`nService Status:" -ForegroundColor Green
kubectl get svc -n $NAMESPACE

# Step 10: Get external IP
Write-Host "`nWaiting for LoadBalancer IP..." -ForegroundColor Yellow
$ExternalIP = ""
for ($i = 1; $i -le 30; $i++) {
    $ExternalIP = kubectl get svc -n $NAMESPACE irtazafoods-frontend -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    if ($ExternalIP) {
        break
    }
    Write-Host "Waiting for external IP... ($i/30)"
    Start-Sleep -Seconds 10
}

if ($ExternalIP) {
    Write-Host "`n✓ Deployment successful!" -ForegroundColor Green
    Write-Host "Frontend URL: http://$ExternalIP" -ForegroundColor Green
    Write-Host "`nOpening browser..." -ForegroundColor Yellow
    Start-Process "http://$ExternalIP"
} else {
    Write-Host "`nExternal IP not yet assigned. Check with:" -ForegroundColor Yellow
    Write-Host "kubectl get svc -n $NAMESPACE irtazafoods-frontend" -ForegroundColor Yellow
}

Write-Host "`nDeployment complete!" -ForegroundColor Green

