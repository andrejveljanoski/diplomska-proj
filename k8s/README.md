# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the Macedonia Regions application.

## Prerequisites

- Kubernetes cluster (v1.25+)
- kubectl configured
- Nginx Ingress Controller
- cert-manager (for SSL certificates)
- Container registry (Docker Hub, GHCR, etc.)

## Files

- `namespace.yaml` - Creates the macedonia-regions namespace
- `secret.yaml` - Contains sensitive environment variables (DATABASE_URL, API keys)
- `configmap.yaml` - Contains non-sensitive configuration
- `deployment.yaml` - Defines the application deployment with 2 replicas
- `service.yaml` - Exposes the application within the cluster
- `ingress.yaml` - Configures external access with SSL
- `hpa.yaml` - Horizontal Pod Autoscaler for automatic scaling

## Deployment Steps

### 1. Update Configuration

Edit the following files with your actual values:

**secret.yaml:**
```yaml
stringData:
  database-url: "your-actual-database-url"
  nextauth-secret: "generate-with: openssl rand -base64 32"
  r2-access-key-id: "your-r2-key"
  r2-secret-access-key: "your-r2-secret"
```

**configmap.yaml:**
```yaml
data:
  NEXTAUTH_URL: "https://your-domain.com"
  R2_ENDPOINT: "your-r2-endpoint"
  R2_BUCKET_NAME: "your-bucket"
  R2_PUBLIC_URL: "your-public-url"
```

**deployment.yaml:**
```yaml
spec:
  containers:
  - name: app
    image: your-registry/macedonia-regions:latest
```

**ingress.yaml:**
```yaml
spec:
  tls:
  - hosts:
    - your-domain.com
  rules:
  - host: your-domain.com
```

### 2. Build and Push Docker Image

```bash
# Build the image
docker build -t your-registry/macedonia-regions:latest .

# Push to registry
docker push your-registry/macedonia-regions:latest

# For GitHub Container Registry
docker tag macedonia-regions:latest ghcr.io/yourusername/macedonia-regions:latest
docker push ghcr.io/yourusername/macedonia-regions:latest
```

### 3. Install Prerequisites on Cluster

#### Install Nginx Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.5/deploy/static/provider/cloud/deploy.yaml
```

#### Install cert-manager
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml
```

#### Create Let's Encrypt Issuer
```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 4. Deploy Application

```bash
# Apply all manifests in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Or apply all at once
kubectl apply -f k8s/
```

### 5. Verify Deployment

```bash
# Check namespace
kubectl get namespaces | grep macedonia

# Check all resources in namespace
kubectl get all -n macedonia-regions

# Check pods status
kubectl get pods -n macedonia-regions

# Check logs
kubectl logs -f deployment/macedonia-regions -n macedonia-regions

# Check ingress
kubectl get ingress -n macedonia-regions

# Check certificate
kubectl get certificate -n macedonia-regions
```

## Updating the Application

### Rolling Update
```bash
# Build and push new image with tag
docker build -t your-registry/macedonia-regions:v1.0.1 .
docker push your-registry/macedonia-regions:v1.0.1

# Update deployment
kubectl set image deployment/macedonia-regions \
  app=your-registry/macedonia-regions:v1.0.1 \
  -n macedonia-regions

# Check rollout status
kubectl rollout status deployment/macedonia-regions -n macedonia-regions
```

### Rollback
```bash
# View rollout history
kubectl rollout history deployment/macedonia-regions -n macedonia-regions

# Rollback to previous version
kubectl rollout undo deployment/macedonia-regions -n macedonia-regions

# Rollback to specific revision
kubectl rollout undo deployment/macedonia-regions --to-revision=2 -n macedonia-regions
```

## Scaling

### Manual Scaling
```bash
# Scale to 5 replicas
kubectl scale deployment macedonia-regions --replicas=5 -n macedonia-regions
```

### Auto-scaling (HPA)
The HPA is already configured and will automatically scale between 2-10 pods based on CPU/memory usage.

```bash
# Check HPA status
kubectl get hpa -n macedonia-regions

# Describe HPA
kubectl describe hpa macedonia-regions -n macedonia-regions
```

## Monitoring

### View Logs
```bash
# All pods
kubectl logs -l app=macedonia-regions -n macedonia-regions

# Specific pod
kubectl logs pod-name -n macedonia-regions

# Follow logs
kubectl logs -f deployment/macedonia-regions -n macedonia-regions
```

### Pod Shell Access
```bash
kubectl exec -it pod-name -n macedonia-regions -- sh
```

### Events
```bash
kubectl get events -n macedonia-regions --sort-by='.lastTimestamp'
```

## Troubleshooting

### Pod not starting
```bash
kubectl describe pod pod-name -n macedonia-regions
kubectl logs pod-name -n macedonia-regions
```

### Service not accessible
```bash
kubectl describe service macedonia-regions -n macedonia-regions
kubectl get endpoints macedonia-regions -n macedonia-regions
```

### Ingress issues
```bash
kubectl describe ingress macedonia-regions -n macedonia-regions
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

### Certificate issues
```bash
kubectl describe certificate macedonia-regions-tls -n macedonia-regions
kubectl describe certificaterequest -n macedonia-regions
kubectl logs -n cert-manager deployment/cert-manager
```

## Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete namespace (deletes everything in it)
kubectl delete namespace macedonia-regions
```

## Production Considerations

1. **Secrets Management**: Use external secrets managers (AWS Secrets Manager, HashiCorp Vault)
2. **Resource Limits**: Adjust based on actual load testing
3. **Persistent Storage**: Add if you need to store files locally
4. **Monitoring**: Install Prometheus + Grafana for metrics
5. **Logging**: Set up centralized logging (ELK, Loki)
6. **Backup**: Regular database backups
7. **CI/CD**: Automate deployments with GitHub Actions, GitLab CI, or ArgoCD
