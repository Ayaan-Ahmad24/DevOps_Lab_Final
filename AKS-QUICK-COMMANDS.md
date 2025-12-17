# Quick AKS Commands for Southeast Asia

## Create Resource Group and AKS Cluster

### Option 1: Run the Script
```powershell
.\create-aks-cluster.ps1
```

### Option 2: Run Commands Manually

#### Step 1: Set Variables
```powershell
$RESOURCE_GROUP = "irtazafoods-rg"
$CLUSTER_NAME = "irtazafoods-aks"
$LOCATION = "southeastasia"
```

#### Step 2: Create Resource Group
```powershell
az group create --name $RESOURCE_GROUP --location $LOCATION
```

#### Step 3: Create AKS Cluster (takes 10-15 minutes)
```powershell
az aks create `
  --resource-group $RESOURCE_GROUP `
  --name $CLUSTER_NAME `
  --location $LOCATION `
  --node-count 2 `
  --node-vm-size Standard_B2s `
  --generate-ssh-keys
```

#### Step 4: Get Cluster Credentials
```powershell
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
```

#### Step 5: Verify Connection
```powershell
kubectl get nodes
```

---

## All-in-One Command (Copy and Paste)

```powershell
$RESOURCE_GROUP = "irtazafoods-rg"; $CLUSTER_NAME = "irtazafoods-aks"; $LOCATION = "southeastasia"; az group create --name $RESOURCE_GROUP --location $LOCATION; az aks create --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --location $LOCATION --node-count 2 --node-vm-size Standard_B2s --generate-ssh-keys; az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME; kubectl get nodes
```

---

## After Cluster Creation

### Deploy Application
```powershell
# Update deployment.yaml with your Docker Hub username first!
# Then deploy:
kubectl apply -f k8s\namespace.yaml
kubectl apply -f k8s\pvc.yaml
kubectl apply -f k8s\deployment.yaml
kubectl apply -f k8s\service.yaml
```

### Check Status
```powershell
kubectl get pods -n irtazafoods
kubectl get svc -n irtazafoods
```

### Get Public IP
```powershell
kubectl get svc -n irtazafoods irtazafoods-frontend
```

---

## Cleanup (After Submission)
```powershell
az aks delete --resource-group irtazafoods-rg --name irtazafoods-aks --yes
az group delete --name irtazafoods-rg --yes
```

