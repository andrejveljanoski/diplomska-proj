# Docker & Kubernetes Deployment Guide

Complete guide for deploying the Macedonia Regions application using Docker and Kubernetes.

## 📋 Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [VPS Deployment](#vps-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [CI/CD Setup](#cicd-setup)
5. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## 🐳 Docker Deployment

### Prerequisites

- Docker Desktop installed
- Docker Compose installed
- `.env` file with your credentials

### Local Testing

#### 1. Build the Image

```bash
docker build -t macedonia-regions:latest .
```

**Build time:** ~40-50 seconds (with caching)  
**Image size:** ~309MB (74.6MB compressed)

#### 2. Run with Docker Compose

```bash
# Start the application
docker-compose up

# Or run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The application will be available at: **http://localhost:3000**

#### 3. Run Standalone (without docker-compose)

```bash
docker run -p 3000:3000 \
  --env-file .env \
  macedonia-regions:latest
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
AUTH_TRUST_HOST=true
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=your-bucket
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### Dockerfile Optimization

The Dockerfile uses **multi-stage builds** for optimal image size:

- **Stage 1 (deps):** Install dependencies
- **Stage 2 (builder):** Build the Next.js application
- **Stage 3 (runner):** Production runtime (only this becomes the final image)

**Benefits:**
- Reduces image size by ~87% (from 1.2GB to 309MB)
- Faster deployments
- Better security (no build tools in production)

---

## 🖥️ VPS Deployment

Deploy to a Virtual Private Server (DigitalOcean, Linode, Hetzner, etc.)

### 1. Server Setup

#### Choose a VPS Provider

| Provider | Recommended Plan | Price | Specs |
|----------|-----------------|-------|-------|
| **Hetzner Cloud** | CX21 | €4.90/mo | 2 vCPU, 4GB RAM, 40GB SSD |
| **DigitalOcean** | Basic Droplet | $12/mo | 2 vCPU, 2GB RAM, 50GB SSD |
| **Linode** | Shared 2GB | $12/mo | 1 vCPU, 2GB RAM, 50GB SSD |

#### Initial Server Configuration

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Setup firewall
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable

# Create app directory
mkdir -p /opt/macedonia-regions
cd /opt/macedonia-regions
```

### 2. Deploy Application

```bash
# Upload your code (Option 1: Git)
git clone https://github.com/yourusername/macedonia-regions.git .

# Or (Option 2: Direct upload via SCP)
scp -r . root@your-server-ip:/opt/macedonia-regions/

# Create .env file with your credentials
nano .env
# (paste your environment variables)

# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 3. Setup Nginx Reverse Proxy

```bash
# Install Nginx
apt install nginx -y

# Create site configuration
cat > /etc/nginx/sites-available/macedonia-regions <<'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/macedonia-regions /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 4. Setup SSL with Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is setup automatically
# Test renewal: certbot renew --dry-run
```

### 5. Auto-restart on Boot

```bash
# Create systemd service
cat > /etc/systemd/system/macedonia-regions.service <<'EOF'
[Unit]
Description=Macedonia Regions Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/macedonia-regions
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
systemctl enable macedonia-regions
systemctl start macedonia-regions
systemctl status macedonia-regions
```

### 6. Updating the Application

```bash
cd /opt/macedonia-regions

# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or for zero-downtime updates
docker-compose build
docker-compose up -d
```

---

## ☸️ Kubernetes Deployment

For production-grade deployments with auto-scaling and high availability.

### Prerequisites

- Kubernetes cluster (v1.25+)
- `kubectl` configured
- Container registry account (Docker Hub, GitHub Container Registry)

### 1. Build and Push Image

#### Using Docker Hub

```bash
# Login
docker login

# Build and tag
docker build -t yourusername/macedonia-regions:latest .
docker tag macedonia-regions:latest yourusername/macedonia-regions:v1.0.0

# Push
docker push yourusername/macedonia-regions:latest
docker push yourusername/macedonia-regions:v1.0.0
```

#### Using GitHub Container Registry

```bash
# Login (create token at github.com/settings/tokens)
echo $GITHUB_TOKEN | docker login ghcr.io -u yourusername --password-stdin

# Build and push
docker build -t ghcr.io/yourusername/macedonia-regions:latest .
docker push ghcr.io/yourusername/macedonia-regions:latest
```

### 2. Configure Kubernetes Manifests

All manifests are in the `k8s/` directory. Update these files:

#### `k8s/secret.yaml`
```yaml
stringData:
  database-url: "your-actual-neon-database-url"
  nextauth-secret: "generate-with: openssl rand -base64 32"
  r2-access-key-id: "your-r2-access-key"
  r2-secret-access-key: "your-r2-secret-key"
```

#### `k8s/configmap.yaml`
```yaml
data:
  NEXTAUTH_URL: "https://your-domain.com"
  R2_ENDPOINT: "your-r2-endpoint"
  R2_BUCKET_NAME: "your-bucket"
  R2_PUBLIC_URL: "your-public-url"
```

#### `k8s/deployment.yaml`
```yaml
spec:
  containers:
  - image: ghcr.io/yourusername/macedonia-regions:latest
```

#### `k8s/ingress.yaml`
```yaml
spec:
  tls:
  - hosts:
    - your-domain.com
  rules:
  - host: your-domain.com
```

### 3. Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f k8s/

# Or apply individually in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### 4. Verify Deployment

```bash
# Check all resources
kubectl get all -n macedonia-regions

# Check pods
kubectl get pods -n macedonia-regions

# Check logs
kubectl logs -f deployment/macedonia-regions -n macedonia-regions

# Check ingress
kubectl get ingress -n macedonia-regions
```

### 5. Setup Nginx Ingress & cert-manager

```bash
# Install Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.5/deploy/static/provider/cloud/deploy.yaml

# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml

# Create Let's Encrypt issuer
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

### 6. Updating Kubernetes Deployment

```bash
# Build new version
docker build -t ghcr.io/yourusername/macedonia-regions:v1.0.1 .
docker push ghcr.io/yourusername/macedonia-regions:v1.0.1

# Update deployment (rolling update)
kubectl set image deployment/macedonia-regions \
  app=ghcr.io/yourusername/macedonia-regions:v1.0.1 \
  -n macedonia-regions

# Check rollout status
kubectl rollout status deployment/macedonia-regions -n macedonia-regions

# Rollback if needed
kubectl rollout undo deployment/macedonia-regions -n macedonia-regions
```

---

## 🔄 CI/CD Setup

### GitHub Actions for Docker VPS

Create `.github/workflows/deploy-docker.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/macedonia-regions
            git pull
            docker-compose down
            docker-compose up -d --build
```

**Required Secrets:**
- `VPS_HOST`: Your server IP
- `VPS_USERNAME`: SSH username (usually `root`)
- `VPS_SSH_KEY`: Private SSH key

### GitHub Actions for Kubernetes

Create `.github/workflows/deploy-k8s.yml`:

```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
      
      - name: Deploy to K8s
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        run: |
          echo "$KUBE_CONFIG" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig
          kubectl set image deployment/macedonia-regions \
            app=ghcr.io/${{ github.repository }}:${{ github.sha }} \
            -n macedonia-regions
          kubectl rollout status deployment/macedonia-regions -n macedonia-regions
```

**Required Secrets:**
- `KUBE_CONFIG`: Base64-encoded kubeconfig file

To generate `KUBE_CONFIG`:
```bash
cat ~/.kube/config | base64 -w 0
```

---

## 📊 Monitoring & Troubleshooting

### Docker Monitoring

```bash
# View logs
docker-compose logs -f
docker-compose logs -f --tail=100

# Container stats
docker stats

# Check health
docker-compose ps
docker inspect diplomska-proj-app-1 | grep -A 10 Health

# Access container shell
docker-compose exec app sh
```

### Kubernetes Monitoring

```bash
# Pod logs
kubectl logs -f deployment/macedonia-regions -n macedonia-regions

# Pod details
kubectl describe pod <pod-name> -n macedonia-regions

# Events
kubectl get events -n macedonia-regions --sort-by='.lastTimestamp'

# Resource usage
kubectl top pods -n macedonia-regions
kubectl top nodes

# Shell access
kubectl exec -it <pod-name> -n macedonia-regions -- sh
```

### Common Issues

#### Issue: Container won't start

```bash
# Check logs
docker-compose logs app

# Common causes:
# - Missing environment variables
# - Database connection issues
# - Port already in use
```

#### Issue: Database connection failed

```bash
# Test database connection
docker-compose exec app sh
# Inside container:
node -e "require('pg').Pool({ connectionString: process.env.DATABASE_URL }).query('SELECT 1')"
```

#### Issue: Image build fails

```bash
# Clean Docker cache
docker builder prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### Issue: Kubernetes pods crashing

```bash
# Check pod status
kubectl get pods -n macedonia-regions

# Check logs
kubectl logs <pod-name> -n macedonia-regions

# Check events
kubectl describe pod <pod-name> -n macedonia-regions
```

---

## 📈 Performance Comparison

| Metric | Docker/VPS | Kubernetes |
|--------|-----------|------------|
| **Setup Time** | 30-60 min | 2-4 hours |
| **Monthly Cost** | $5-12 | $12-36+ |
| **Deployment Time** | 2-5 min | 30-60 sec |
| **Auto-scaling** | ❌ Manual | ✅ Automatic (HPA) |
| **High Availability** | ❌ Single point | ✅ Multi-replica |
| **Rollback** | Manual | One command |
| **SSL Setup** | Certbot | Cert-manager |
| **Learning Curve** | Low | High |
| **Best For** | Small-medium apps | Enterprise, scale |

---

## 🎓 Thesis Considerations

### Data to Collect for Comparison

1. **Performance Metrics:**
   - Build time
   - Image size
   - Cold start time
   - Response time under load
   - Time to first byte (TTFB)

2. **Cost Analysis:**
   - VPS monthly cost
   - K8s cluster cost
   - Bandwidth costs
   - Storage costs

3. **Developer Experience:**
   - Time to deploy
   - Ease of rollback
   - Debugging difficulty
   - CI/CD complexity

4. **Scalability:**
   - Manual vs auto-scaling
   - Scale-up time
   - Max concurrent users
   - Resource efficiency

### Testing Tools

```bash
# Performance testing with k6
docker run -i grafana/k6 run - <script.js

# Load testing with Apache Bench
ab -n 1000 -c 10 http://your-domain.com/

# Lighthouse CI for performance metrics
npm install -g @lhci/cli
lhci autorun --collect.url=http://your-domain.com
```

---

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Last Updated:** January 17, 2026
