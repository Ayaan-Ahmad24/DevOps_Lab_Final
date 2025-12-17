# AKS Deployment Verification Script
# Usage: .\verify-aks-deployment.ps1

$NAMESPACE = "irtazafoods"

Write-Host "=== AKS Deployment Verification ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check All Pods are Running
Write-Host "1. Pod Status:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
kubectl get pods -n $NAMESPACE
Write-Host ""

# Check if all pods are running
$pods = kubectl get pods -n $NAMESPACE -o json | ConvertFrom-Json
$runningPods = ($pods.items | Where-Object { $_.status.phase -eq "Running" }).Count
$totalPods = $pods.items.Count

if ($runningPods -eq $totalPods) {
    Write-Host "✓ All $totalPods pods are Running" -ForegroundColor Green
} else {
    Write-Host "⚠ $runningPods/$totalPods pods are Running" -ForegroundColor Yellow
}
Write-Host ""

# 2. Check Services Created Successfully
Write-Host "2. Service Status:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
kubectl get svc -n $NAMESPACE
Write-Host ""

# Get External IP
$frontendSvc = kubectl get svc -n $NAMESPACE irtazafoods-frontend -o json | ConvertFrom-Json
$externalIP = $frontendSvc.status.loadBalancer.ingress[0].ip

if ($externalIP) {
    Write-Host "✓ Frontend External IP: http://$externalIP" -ForegroundColor Green
} else {
    Write-Host "⚠ External IP not yet assigned" -ForegroundColor Yellow
}
Write-Host ""

# 3. Verify Frontend Connecting to Backend
Write-Host "3. Frontend to Backend Connection:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
$frontendPod = (kubectl get pod -n $NAMESPACE -l app=irtazafoods-frontend -o jsonpath='{.items[0].metadata.name}')
Write-Host "Frontend Pod: $frontendPod"
Write-Host "Testing connection to backend..."
try {
    $result = kubectl exec -n $NAMESPACE $frontendPod -- curl -s http://irtazafoods-backend:5000/api/menu/get 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend can reach backend" -ForegroundColor Green
    } else {
        Write-Host "⚠ Frontend cannot reach backend" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Could not test frontend-backend connection" -ForegroundColor Yellow
}
Write-Host ""

# 4. Verify Backend Connecting to Database
Write-Host "4. Backend to Database Connection:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
$backendPod = (kubectl get pod -n $NAMESPACE -l app=irtazafoods-backend -o jsonpath='{.items[0].metadata.name}')
Write-Host "Backend Pod: $backendPod"
Write-Host "Checking backend logs for database connection..."
$backendLogs = kubectl logs -n $NAMESPACE $backendPod --tail=20
if ($backendLogs -match "connected|Connected|Mongoose connected") {
    Write-Host "✓ Backend connected to database" -ForegroundColor Green
    Write-Host "Log snippet:" -ForegroundColor Gray
    $backendLogs | Select-String -Pattern "connected|Connected" | Select-Object -First 2
} else {
    Write-Host "⚠ Could not verify database connection in logs" -ForegroundColor Yellow
    Write-Host "Recent logs:" -ForegroundColor Gray
    $backendLogs | Select-Object -Last 5
}
Write-Host ""

# 5. Deployment Summary
Write-Host "=== Deployment Summary ===" -ForegroundColor Cyan
Write-Host "Pods Running: $runningPods/$totalPods" -ForegroundColor $(if ($runningPods -eq $totalPods) { "Green" } else { "Yellow" })
Write-Host "Services: $(($pods.items | Select-Object -Unique -Property 'metadata.namespace').Count) created" -ForegroundColor Green
if ($externalIP) {
    Write-Host "Public URL: http://$externalIP" -ForegroundColor Green
}
Write-Host ""

Write-Host "=== Screenshots Needed ===" -ForegroundColor Cyan
Write-Host "1. kubectl get pods -n $NAMESPACE" -ForegroundColor Yellow
Write-Host "2. kubectl get svc -n $NAMESPACE" -ForegroundColor Yellow
Write-Host "3. Browser showing application at http://$externalIP" -ForegroundColor Yellow
Write-Host ""

