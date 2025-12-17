# Complete AKS Deployment Script
# Usage: .\deploy-to-aks-complete.ps1 YOUR_DOCKERHUB_USERNAME

param(
    [Parameter(Mandatory = $true)]
    [string]$DockerUsername
)

$ErrorActionPreference = "Stop"
$NAMESPACE = "irtazafoods"

Write-Host "=== AKS Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Update deployment.yaml with Docker Hub username
Write-Host "Step 1: Updating manifests with Docker Hub username: $DockerUsername" -ForegroundColor Yellow
$deploymentFile = "k8s\deployment.yaml"
if (Test-Path $deploymentFile) {
    $content = Get-Content $deploymentFile -Raw
    $content = $content -replace "YOUR_DOCKERHUB_USERNAME", $DockerUsername
    Set-Content -Path $deploymentFile -Value $content
    Write-Host "✓ Manifests updated" -ForegroundColor Green
}
else {
    Write-Host "✗ Error: k8s\deployment.yaml not found!" -ForegroundColor Red
    exit 1
}

# Step 2: Create namespace
Write-Host "`nStep 2: Creating namespace..." -ForegroundColor Yellow
kubectl apply -f k8s\namespace.yaml
Write-Host "✓ Namespace created" -ForegroundColor Green

# Step 3: Create PVC
Write-Host "`nStep 3: Creating PersistentVolumeClaim for MongoDB..." -ForegroundColor Yellow
kubectl apply -f k8s\pvc.yaml
Write-Host "✓ PVC created" -ForegroundColor Green

# Step 4: Wait for PVC to be bound
Write-Host "`nStep 4: Waiting for PVC to be bound..." -ForegroundColor Yellow
kubectl wait --for=condition=Bound pvc/mongo-pvc -n $NAMESPACE --timeout=60s 2>$null
Write-Host "✓ PVC bound" -ForegroundColor Green

# Step 5: Deploy applications
Write-Host "`nStep 5: Deploying applications (MongoDB, Backend, Frontend)..." -ForegroundColor Yellow
kubectl apply -f k8s\deployment.yaml
Write-Host "✓ Deployments created" -ForegroundColor Green

# Step 6: Deploy Services
Write-Host "`nStep 6: Deploying Services..." -ForegroundColor Yellow
kubectl apply -f k8s\service.yaml
Write-Host "✓ Services created" -ForegroundColor Green

# Step 7: Wait for deployments to be ready
Write-Host "`nStep 7: Waiting for deployments to be ready (this may take a few minutes)..." -ForegroundColor Yellow
Write-Host "Waiting for MongoDB..." -ForegroundColor Gray
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-db -n $NAMESPACE 2>$null
Write-Host "Waiting for Backend..." -ForegroundColor Gray
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-backend -n $NAMESPACE 2>$null
Write-Host "Waiting for Frontend..." -ForegroundColor Gray
kubectl wait --for=condition=available --timeout=300s deployment/irtazafoods-frontend -n $NAMESPACE 2>$null
Write-Host "✓ All deployments ready" -ForegroundColor Green

# Step 8: Get pod status
Write-Host "`n=== Pod Status ===" -ForegroundColor Cyan
kubectl get pods -n $NAMESPACE

# Step 9: Get service status
Write-Host "`n=== Service Status ===" -ForegroundColor Cyan
kubectl get svc -n $NAMESPACE

# Step 10: Get external IP
Write-Host "`nStep 8: Waiting for LoadBalancer IP (this may take 5-10 minutes)..." -ForegroundColor Yellow
$ExternalIP = ""
for ($i = 1; $i -le 30; $i++) {
    $ExternalIP = kubectl get svc -n $NAMESPACE irtazafoods-frontend -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    if ($ExternalIP) {
        break
    }
    Write-Host "Waiting for external IP... ($i/30)" -ForegroundColor Gray
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "=== Deployment Summary ===" -ForegroundColor Cyan
if ($ExternalIP) {
    Write-Host "✓ Deployment successful!" -ForegroundColor Green
    Write-Host "Frontend URL: http://$ExternalIP" -ForegroundColor Green
    Write-Host "`nOpening browser..." -ForegroundColor Yellow
    Start-Process "http://$ExternalIP"
}
else {
    Write-Host "⚠ External IP not yet assigned" -ForegroundColor Yellow
    Write-Host "Check status with: kubectl get svc -n $NAMESPACE irtazafoods-frontend" -ForegroundColor Yellow
}

Write-Host "`n=== Verification Commands ===" -ForegroundColor Cyan
Write-Host "kubectl get pods -n $NAMESPACE" -ForegroundColor Yellow
Write-Host "kubectl get svc -n $NAMESPACE" -ForegroundColor Yellow
Write-Host "kubectl logs -n $NAMESPACE -l app=irtazafoods-backend --tail=20" -ForegroundColor Yellow

