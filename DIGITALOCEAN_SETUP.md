# DigitalOcean Deployment Guide

Complete step-by-step guide to deploy Macedonia Regions on DigitalOcean.

## Why DigitalOcean?

- **Easy to use** - Best interface and documentation
- **$200 Free Credit** - 60 days regular, or 12 months with GitHub Student Pack
- **Great for learning** - Excellent tutorials and community
- **Managed Kubernetes** - Easy K8s setup for comparison
- **Predictable pricing** - Simple, transparent costs

---

## 1. Sign Up & Get Free Credits

### Option A: GitHub Student Pack (Best - 12 months)

**Get $200 credit for 1 year + free .me domain**

1. **Apply for GitHub Student Pack:**
   - Go to: https://education.github.com/pack
   - Click **"Get your Pack"**
   - Sign in with GitHub
   - Verify student status:
     - **University email** (preferred): your-name@student.ukim.edu.mk
     - Or **Upload student ID card**
   - Fill in university details:
     - School name: "Ss. Cyril and Methodius University"
     - Graduation year: Your expected year
   - Submit and wait for approval (usually 1-7 days)

2. **Activate DigitalOcean Credit:**
   - Once approved, go to GitHub Student Pack benefits
   - Find **DigitalOcean** offer
   - Click **"Get access"**
   - Sign up for DigitalOcean (creates new account with $200 credit)

### Option B: Regular Signup (60 days)

**Get $200 credit for 60 days**

1. Go to: https://www.digitalocean.com/
2. Click **"Sign Up"** 
3. Sign up with:
   - Email & password, or
   - GitHub account (recommended)
4. Verify email
5. Add credit card (required, won't be charged during trial)
6. Automatically get $200 credit for 60 days

**Credit Usage Examples:**
- $200 = 16+ months of $12/month Droplet
- $200 = 40+ months of $4/month Droplet
- $200 = ~20 days of $10/day Kubernetes cluster

---

## 2. Create Your First Droplet (VPS)

### Step 1: Navigate to Droplets

1. Login to DigitalOcean
2. Click **"Create"** → **"Droplets"** (top right)

### Step 2: Choose Configuration

#### **Choose an Image:**
- **Distribution:** Ubuntu
- **Version:** **Ubuntu 24.04 LTS x64** (recommended)
- Or: Ubuntu 22.04 LTS x64 (also good)

#### **Choose Size:**

**Recommended for Your App:**

**Basic - Regular (Best Value):**
- **$12/month** ⭐ RECOMMENDED
  - 2 GB RAM / 2 vCPUs
  - 50 GB SSD
  - 2 TB transfer
  - Perfect for production

**Alternative (Testing):**
- **$4/month** (cheaper for testing)
  - 512 MB RAM / 1 vCPU
  - 10 GB SSD
  - 500 GB transfer
  - Good for initial testing

**For Kubernetes (later):**
- Premium - CPU-Optimized
- $40/month for 2-node cluster
- (We'll cover this separately)

#### **Choose a Datacenter Region:**

Select closest to you or your users:
- **Amsterdam** (good for Europe)
- **Frankfurt** (good for Europe)
- **London** (good for Europe/UK)
- **New York** (good for North America)

#### **Authentication:**

**Option 1: SSH Key (Recommended - More Secure)**

**On your local machine (PowerShell):**
```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter for default location: C:\Users\andre\.ssh\id_ed25519
# Set a passphrase (optional but recommended)

# Display public key
cat C:\Users\andre\.ssh\id_ed25519.pub
# Copy the output
```

**On DigitalOcean:**
- Click **"New SSH Key"**
- Paste the public key
- Name: "My-Laptop" or "Windows-PC"
- Click **"Add SSH Key"**
- ✅ Select this key for your Droplet

**Option 2: Password (Easier but Less Secure)**
- Root password will be emailed to you
- You'll be forced to change it on first login

#### **Finalize Details:**

**Hostname:** `macedonia-regions` (or any name you want)

**Tags:** `production`, `docker`, `thesis` (optional, for organization)

**Backups:** Uncheck (costs extra, not needed for thesis)

**Monitoring:** ✅ Check (free, useful for metrics)

**IPv6:** ✅ Check (free, future-proof)

### Step 3: Create Droplet

1. Click **"Create Droplet"**
2. Wait 1-2 minutes for provisioning
3. **Copy your Droplet's IP address** (you'll need this!)

---

## 3. Connect to Your Droplet

### Get Connection Details

From DigitalOcean dashboard:
- **IP Address:** Shows on Droplet card
- **Username:** `root` (default for Ubuntu)
- **SSH Key:** The one you created earlier

### Connect via SSH

**Windows PowerShell:**
```powershell
# Connect with SSH key (if you used Option 1)
ssh root@YOUR_DROPLET_IP

# Or if you set a passphrase:
ssh -i C:\Users\andre\.ssh\id_ed25519 root@YOUR_DROPLET_IP
```

**First time connecting:**
- Type `yes` when asked about fingerprint

**If using password (Option 2):**
- Check your email for temporary password
- SSH will ask you to change it on first login

**Troubleshooting connection issues:**
```powershell
# If "permission denied", check key permissions
icacls C:\Users\andre\.ssh\id_ed25519 /inheritance:r
icacls C:\Users\andre\.ssh\id_ed25519 /grant:r "$($env:USERNAME):(R)"
```

---

## 4. Initial Server Setup

Once connected via SSH, run these commands:

```bash
# Update system packages
apt update && apt upgrade -y

# Install essential packages
apt install -y curl git ufw nano htop

# Setup firewall
ufw allow OpenSSH      # Allow SSH (port 22)
ufw allow 80/tcp       # Allow HTTP
ufw allow 443/tcp      # Allow HTTPS
ufw --force enable     # Enable firewall
ufw status             # Check status

# Create a non-root user (security best practice)
adduser deployer
# Set a strong password when prompted
# Press Enter for all other prompts (or fill in if you want)

# Add user to sudo group
usermod -aG sudo deployer

# Add your SSH key to new user (if using SSH key authentication)
mkdir -p /home/deployer/.ssh
cp /root/.ssh/authorized_keys /home/deployer/.ssh/
chown -R deployer:deployer /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
chmod 600 /home/deployer/.ssh/authorized_keys

# Test new user (open a new terminal, keep current one open)
# ssh deployer@YOUR_DROPLET_IP
# If it works, continue. If not, fix permissions above.
```

**Now logout and login as deployer:**
```bash
exit
```

```powershell
# On your local machine
ssh deployer@YOUR_DROPLET_IP
```

---

## 5. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose (plugin)
sudo apt install -y docker-compose-plugin

# Logout and login again for docker group to take effect
exit
```

**Reconnect:**
```powershell
ssh deployer@YOUR_DROPLET_IP
```

**Verify installations:**
```bash
docker --version
# Should show: Docker version 25.x.x

docker compose version
# Should show: Docker Compose version v2.x.x

# Test docker without sudo
docker run hello-world
# Should download and run successfully
```

---

## 6. Deploy Your Application

### Option 1: Clone from GitHub (Recommended)

**If you have a GitHub repository:**

```bash
# Create app directory
mkdir -p ~/apps/macedonia-regions
cd ~/apps/macedonia-regions

# Clone your repository (public repo)
git clone https://github.com/YOUR_USERNAME/macedonia-regions.git .

# Or clone private repo with token
git clone https://YOUR_GITHUB_TOKEN@github.com/YOUR_USERNAME/macedonia-regions.git .
```

**Don't have a GitHub repo yet?** Let's create one:

**On your local machine:**
```powershell
cd C:\Users\andre\macedonia-regions\diplomska-proj

# Initialize git if not already
git init
git add .
git commit -m "Initial commit with Docker support"

# Create repo on GitHub.com (through website)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/macedonia-regions.git
git branch -M main
git push -u origin main
```

### Option 2: Upload Files Directly (Alternative)

**On your local machine (PowerShell):**
```powershell
# Navigate to project
cd C:\Users\andre\macedonia-regions\diplomska-proj

# Upload to server using SCP
scp -r * deployer@YOUR_DROPLET_IP:~/apps/macedonia-regions/
```

### Create Environment File

**On the Droplet:**
```bash
cd ~/apps/macedonia-regions

# Create .env file
nano .env
```

**Paste your environment variables:**
```env
NODE_ENV=production

# Database (Your Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_fEQx79NLzopm@ep-delicate-fog-agkxpuhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Auth.js
NEXTAUTH_URL=http://YOUR_DROPLET_IP:3000
NEXTAUTH_SECRET=k7Xp2mN9qR4sT8vB3wY6zA1cD5eF0gH2jK7mP9rS4tU=
AUTH_TRUST_HOST=true

# Cloudflare R2
R2_ENDPOINT=https://a223e53d31cc34c5968ee9c0a674903a.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=63bb03608e39a2c087caa9c4331e9d0c
R2_SECRET_ACCESS_KEY=a97c7bea81e2c7b5e6eb59596e49d354cff215648568a2b74b05dccdb503363b
R2_BUCKET_NAME=macedonia-regions
R2_PUBLIC_URL=https://pub-b9d54b7cd30042a0aab7e0c72155183d.r2.dev
```

**Save:** `Ctrl+O`, Enter, `Ctrl+X`

### Build and Run

```bash
# Make sure you're in the project directory
cd ~/apps/macedonia-regions

# Build and start the application
docker compose up -d

# Check if it's running
docker compose ps

# View logs
docker compose logs -f
# Press Ctrl+C to exit logs (container keeps running)
```

**Test the application:**
```bash
# From the server
curl http://localhost:3000

# From your browser
http://YOUR_DROPLET_IP:3000
```

If you see your app, it's working! 🎉

---

## 7. Setup Nginx Reverse Proxy

This allows you to access your app on port 80 (HTTP) instead of 3000.

```bash
# Install Nginx
sudo apt install -y nginx

# Create configuration file
sudo nano /etc/nginx/sites-available/macedonia-regions
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name YOUR_DROPLET_IP;  # Replace with your IP or domain

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy settings
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Increase max upload size for images
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

**Save:** `Ctrl+O`, Enter, `Ctrl+X`

**Enable the site:**
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/macedonia-regions /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx
sudo systemctl status nginx
```

**Test:**
```
http://YOUR_DROPLET_IP
```

Your app should now work on port 80! 🎉

---

## 8. Setup Domain (Optional but Recommended)

### Get a Domain

**Free Options:**
1. **GitHub Student Pack** - Free `.me` domain for 1 year (Namecheap)
2. **Freenom** - Free domains (discontinued for new registrations)
3. **DuckDNS** - Free subdomain: `yourname.duckdns.org`

**Paid Options (Cheap):**
1. **Namecheap** - .com domains ~$9/year
2. **Cloudflare** - .xyz domains ~$1/year
3. **Porkbun** - Various TLDs, good prices

### Example: Using Namecheap (Free with Student Pack)

**On Namecheap:**
1. Get domain from GitHub Student Pack benefits
2. Go to Domain List → Manage
3. Advanced DNS
4. Add Record:
   - **Type:** A Record
   - **Host:** `@`
   - **Value:** `YOUR_DROPLET_IP`
   - **TTL:** Automatic
5. Add Record (optional, for www):
   - **Type:** A Record
   - **Host:** `www`
   - **Value:** `YOUR_DROPLET_IP`
   - **TTL:** Automatic

**Wait 5-60 minutes for DNS propagation**

### Update Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/macedonia-regions
```

**Change the `server_name` line:**
```nginx
server_name yourdomain.com www.yourdomain.com;
```

**Restart Nginx:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

**Test:**
```
http://yourdomain.com
```

---

## 9. Setup SSL Certificate (Let's Encrypt)

Free SSL certificate for HTTPS!

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# 1. Enter email address
# 2. Agree to Terms of Service (A)
# 3. Share email with EFF (Y or N, your choice)
# 4. Choose redirect option: 2 (Redirect HTTP to HTTPS)
```

**Certbot will automatically:**
- ✅ Get SSL certificate
- ✅ Update Nginx configuration
- ✅ Setup auto-renewal (runs twice daily)

**Update your .env file:**
```bash
cd ~/apps/macedonia-regions
nano .env

# Change NEXTAUTH_URL to:
NEXTAUTH_URL=https://yourdomain.com
```

**Restart your app:**
```bash
docker compose restart
```

**Test:**
```
https://yourdomain.com
```

You should see the padlock icon! 🔒

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

---

## 10. Auto-Start on Reboot

Make sure your app starts automatically if the server reboots.

```bash
# Create systemd service
sudo nano /etc/systemd/system/macedonia-regions.service
```

**Paste:**
```ini
[Unit]
Description=Macedonia Regions Docker Compose Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
User=deployer
Group=deployer
WorkingDirectory=/home/deployer/apps/macedonia-regions
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

**Save:** `Ctrl+O`, Enter, `Ctrl+X`

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable macedonia-regions
sudo systemctl start macedonia-regions
sudo systemctl status macedonia-regions
```

**Test reboot:**
```bash
sudo reboot
# Wait 1-2 minutes
# Reconnect
ssh deployer@YOUR_DROPLET_IP

# Check if app is running
docker compose ps
curl http://localhost:3000
```

---

## 11. Monitoring & Maintenance

### View Logs

```bash
# Application logs
cd ~/apps/macedonia-regions
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u macedonia-regions -f
```

### Monitor Resources

```bash
# Docker stats (real-time)
docker stats

# System resources
htop
# Press F10 to quit

# Disk usage
df -h

# Memory usage
free -h
```

### DigitalOcean Monitoring

1. Go to DigitalOcean dashboard
2. Click on your Droplet
3. View **Graphs** tab:
   - CPU usage
   - Memory usage
   - Disk I/O
   - Bandwidth

### Update Application

```bash
cd ~/apps/macedonia-regions

# Pull latest code
git pull

# Rebuild and restart
docker compose down
docker compose up -d --build

# Or without downtime
docker compose build
docker compose up -d

# Check logs
docker compose logs -f
```

### Backup .env File

```bash
# Backup to home directory
cp ~/apps/macedonia-regions/.env ~/macedonia-env-backup
```

---

## 12. Performance Optimization

### Enable UFW Rate Limiting (DDoS Protection)

```bash
# Limit SSH connections
sudo ufw limit OpenSSH

# Reload firewall
sudo ufw reload
```

### Setup Fail2Ban (Auto-ban failed logins)

```bash
# Install
sudo apt install -y fail2ban

# Start and enable
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status
```

### Optimize Docker

```bash
# Clean up unused Docker resources
docker system prune -a

# View disk usage
docker system df
```

### Setup Swap (if using $4 Droplet with 512MB RAM)

```bash
# Create 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

---

## 13. Cost Management

### Monitor Your Credit

1. Go to **Billing** in DigitalOcean dashboard
2. View **Balance & Billing**
3. See remaining credit and burn rate

**Your $200 Credit:**
- $12/month Droplet = 16+ months
- $4/month Droplet = 50 months
- Monitor usage to stay within credit

### Destroy Droplet When Not Needed

**To save money when testing is done:**
```bash
# From DigitalOcean dashboard
# 1. Click Droplet
# 2. Click "Destroy"
# 3. Confirm

# You can create a new one anytime!
# Billing stops immediately after destruction
```

**Before destroying, backup:**
- Export your code (should be on GitHub)
- Backup .env file
- Document any changes

---

## 14. Next Steps: Kubernetes (Optional)

Want to try DigitalOcean Kubernetes for comparison?

### Create Kubernetes Cluster

1. **In DigitalOcean Dashboard:**
   - Click **"Create"** → **"Kubernetes"**
   - Choose region (same as Droplet)
   - Choose Kubernetes version (latest stable)
   - Node pool: 2 nodes x $12/month = $24/month
   - Name: `macedonia-k8s`
   - Click **"Create Cluster"**

2. **Connect to cluster:**
   ```bash
   # Download kubeconfig from DigitalOcean UI
   # Or install doctl (DigitalOcean CLI)
   
   # On your local machine
   doctl kubernetes cluster kubeconfig save macedonia-k8s
   kubectl get nodes
   ```

3. **Deploy using your k8s manifests:**
   ```bash
   # Update k8s/deployment.yaml with your image
   # Then apply
   kubectl apply -f k8s/
   ```

**Cost:** ~$24/month for 2-node cluster (uses ~$120 of your credit)

---

## 15. Troubleshooting

### Issue: Can't access website

```bash
# Check if app is running
docker compose ps

# Check logs
docker compose logs

# Check if port 3000 is listening
sudo netstat -tulpn | grep 3000

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check firewall
sudo ufw status
```

### Issue: SSL certificate fails

```bash
# Make sure DNS is pointing to your Droplet
nslookup yourdomain.com

# Make sure port 80 is open
sudo ufw status | grep 80

# Try certbot again
sudo certbot --nginx -d yourdomain.com
```

### Issue: Out of memory

```bash
# Check memory
free -h

# Add swap (see section 12)

# Or upgrade Droplet:
# DigitalOcean Dashboard → Resize → Choose bigger plan
```

### Issue: Docker permission denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login
exit
ssh deployer@YOUR_DROPLET_IP
```

---

## 16. Security Best Practices

```bash
# Disable root login via SSH (after setting up deployer user)
sudo nano /etc/ssh/sshd_config
# Change: PermitRootLogin yes → PermitRootLogin no
sudo systemctl restart sshd

# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Regular updates
sudo apt update && sudo apt upgrade -y
```

---

## 📊 Thesis Data Collection

Track these metrics for your comparison:

### Performance
```bash
# Response time
time curl http://localhost:3000

# Load test with Apache Bench
ab -n 1000 -c 10 http://localhost:3000/
```

### Costs
- Droplet: $12/month
- Bandwidth: Included (2TB)
- Backups: $1.20/month (if enabled)
- **Total:** ~$12-13/month

### Deployment Metrics
- Setup time: ~30-60 minutes
- Deployment time: ~5 minutes
- Build time: ~40 seconds

---

## ✅ Summary

**You now have:**
- ✅ DigitalOcean Droplet running Ubuntu
- ✅ Docker & Docker Compose installed
- ✅ Your Next.js app deployed
- ✅ Nginx reverse proxy configured
- ✅ SSL certificate (if using domain)
- ✅ Auto-start on reboot
- ✅ Monitoring enabled

**Your app is live at:**
- `http://YOUR_DROPLET_IP` (or `https://yourdomain.com`)

**Next steps for thesis:**
1. Collect performance metrics
2. Test under load
3. Compare with Kubernetes deployment
4. Document findings

---

**Need help?**
- DigitalOcean Docs: https://docs.digitalocean.com/
- Community: https://www.digitalocean.com/community
- Tutorials: https://www.digitalocean.com/community/tutorials

Good luck with your deployment! 🚀
