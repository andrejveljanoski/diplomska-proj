# Oracle Cloud Free Tier VPS Setup Guide

Complete guide to deploy Macedonia Regions on Oracle Cloud's free tier (forever free).

## Why Oracle Cloud Free Tier?

- **Free Forever** - No time limit, no credit card charges
- **Generous Resources:**
  - Ampere A1 Compute: Up to 4 OCPUs, 24GB RAM (ARM-based)
  - 200GB Block Volume Storage
  - 10TB outbound transfer/month
  - IPv4 address included
- **Perfect for:** Thesis projects, learning, long-term demos

---

## 1. Create Oracle Cloud Account

### Step 1: Sign Up

1. Go to: https://www.oracle.com/cloud/free/
2. Click **"Start for free"**
3. Fill in details:
   - Email address
   - Country (select your location)
   - Name and phone
4. **Verify email and phone** (required)
5. **Credit card verification** (required but won't be charged)
   - Oracle requires this to prevent abuse
   - You'll see a $1 authorization (reversed immediately)
   - Will NEVER charge without your explicit upgrade

### Step 2: Complete Account Setup

1. Choose **"Free Tier"** account type
2. Set home region (CANNOT be changed later!)
   - Choose closest to you or your users
   - Recommended: Frankfurt, Amsterdam, London (EU)
3. Wait for account activation (2-10 minutes)

---

## 2. Create VM Instance

### Step 1: Navigate to Compute

1. Login to Oracle Cloud Console
2. Click **☰ Menu** → **Compute** → **Instances**
3. Click **"Create Instance"**

### Step 2: Configure Instance

**Name:** `macedonia-regions-app`

**Placement:**
- Availability Domain: Any (usually AD-1)
- Fault domain: Leave default

**Image and Shape:**

1. Click **"Change Image"**
   - Select: **Ubuntu 22.04** (recommended)
   - Or: **Ubuntu 24.04 LTS**
   - Click **"Select Image"**

2. Click **"Change Shape"**
   - Shape series: **Ampere** (ARM-based - FREE!)
   - Shape name: **VM.Standard.A1.Flex**
   - **OCPUs:** 2 (or up to 4 if available)
   - **Memory (GB):** 12 (or up to 24 if available)
   - Click **"Select Shape"**

**Networking:**
- VCN: Use default (auto-created)
- Subnet: Public subnet (default)
- **Public IPv4 address:** ✅ Assign a public IPv4 address
- Leave other defaults

**Add SSH Keys:**

**Option A: Auto-generate (Easiest)**
- Select **"Generate a key pair for me"**
- Click **"Save Private Key"** (save as `oracle-vm-key.key`)
- Click **"Save Public Key"** (optional backup)

**Option B: Use your own key**
```bash
# On your local machine (Git Bash/PowerShell)
ssh-keygen -t rsa -b 4096 -f oracle-vm-key
# Upload the .pub file
```

**Boot Volume:**
- Size: **50 GB** (default, plenty for Docker)

### Step 3: Create Instance

1. Click **"Create"**
2. Wait 2-3 minutes for provisioning
3. **Copy the Public IP address** (you'll need this!)

---

## 3. Configure Firewall Rules

Oracle Cloud has TWO firewalls you need to configure:

### A. Cloud Security List (Oracle's Firewall)

1. From instance details, click the **Subnet name** link
2. Click **"Default Security List"**
3. Click **"Add Ingress Rules"**

**Add these rules:**

**Rule 1: HTTP (Port 80)**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `80`
- Description: `HTTP traffic`

**Rule 2: HTTPS (Port 443)**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `443`
- Description: `HTTPS traffic`

**Rule 3: Custom (Port 3000) - Optional for testing**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `3000`
- Description: `Next.js dev server`

### B. Ubuntu UFW Firewall (Inside VM)

We'll configure this after connecting to the server.

---

## 4. Connect to Your Server

### Get Connection Details

From Oracle Cloud Console:
- **Public IP:** Copy from instance details
- **Username:** `ubuntu` (for Ubuntu images)
- **SSH Key:** The private key you downloaded

### Connect via SSH

**Windows (PowerShell):**
```powershell
# Set key permissions (only needed once)
icacls oracle-vm-key.key /inheritance:r
icacls oracle-vm-key.key /grant:r "$($env:USERNAME):(R)"

# Connect
ssh -i oracle-vm-key.key ubuntu@YOUR_PUBLIC_IP
```

**Windows (Git Bash) / Mac / Linux:**
```bash
# Set key permissions (only needed once)
chmod 400 oracle-vm-key.key

# Connect
ssh -i oracle-vm-key.key ubuntu@YOUR_PUBLIC_IP
```

**First time?** Type `yes` when asked about fingerprint.

---

## 5. Initial Server Setup

Once connected via SSH:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl git ufw

# Setup UFW firewall (Ubuntu's firewall)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Next.js (optional, for testing)
sudo ufw --force enable
sudo ufw status

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group (no sudo needed)
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Verify installations
docker --version
docker compose version

# IMPORTANT: Logout and login again for docker group to take effect
exit
```

**Reconnect:**
```bash
ssh -i oracle-vm-key.key ubuntu@YOUR_PUBLIC_IP
```

---

## 6. Deploy Your Application

### Option 1: Using Git (Recommended)

```bash
# Create app directory
mkdir -p ~/macedonia-regions
cd ~/macedonia-regions

# Clone your repository
git clone https://github.com/yourusername/macedonia-regions.git .

# Or if private repo:
git clone https://<YOUR_GITHUB_TOKEN>@github.com/yourusername/macedonia-regions.git .

# Create .env file
nano .env
```

Paste your environment variables:
```env
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_fEQx79NLzopm@ep-delicate-fog-agkxpuhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_URL=http://YOUR_PUBLIC_IP:3000
NEXTAUTH_SECRET=k7Xp2mN9qR4sT8vB3wY6zA1cD5eF0gH2jK7mP9rS4tU=
AUTH_TRUST_HOST=true
R2_ENDPOINT=https://a223e53d31cc34c5968ee9c0a674903a.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=63bb03608e39a2c087caa9c4331e9d0c
R2_SECRET_ACCESS_KEY=a97c7bea81e2c7b5e6eb59596e49d354cff215648568a2b74b05dccdb503363b
R2_BUCKET_NAME=macedonia-regions
R2_PUBLIC_URL=https://pub-b9d54b7cd30042a0aab7e0c72155183d.r2.dev
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Build and run
docker compose up -d

# Check status
docker compose ps
docker compose logs -f
```

### Option 2: Upload Files Directly (Alternative)

**From your local machine (PowerShell/Git Bash):**
```bash
# Navigate to your project
cd C:\Users\andre\macedonia-regions\diplomska-proj

# Upload to server
scp -i oracle-vm-key.key -r * ubuntu@YOUR_PUBLIC_IP:~/macedonia-regions/

# SSH into server
ssh -i oracle-vm-key.key ubuntu@YOUR_PUBLIC_IP

# Navigate and run
cd ~/macedonia-regions
nano .env  # Create .env file as shown above
docker compose up -d
```

---

## 7. Install Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/macedonia-regions
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_PUBLIC_IP;  # Or your domain if you have one

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
        
        # Increase timeout for large uploads
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        client_max_body_size 10M;
    }
}
```

Save and enable:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/macedonia-regions /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl status nginx
```

**Test:** Open `http://YOUR_PUBLIC_IP` in browser!

---

## 8. Setup Domain (Optional but Recommended)

### Get a Free Domain

**Free Options:**
1. **Freenom** (discontinued for new registrations)
2. **DuckDNS** (free subdomain): `yourname.duckdns.org`
3. **Cloudflare** (cheap .xyz domains): ~$1/year
4. **GitHub Student Pack:** Free `.me` domain for 1 year

### Configure DNS

If you have a domain (e.g., `macedonia-regions.com`):

**On your DNS provider (Cloudflare, Namecheap, etc.):**
1. Add **A Record:**
   - Name: `@` (or leave blank)
   - Value: `YOUR_ORACLE_PUBLIC_IP`
   - TTL: Auto or 3600

2. Add **CNAME Record** (optional for www):
   - Name: `www`
   - Value: `macedonia-regions.com`

**Wait 5-60 minutes for DNS propagation**

### Update Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/macedonia-regions
```

Change `server_name`:
```nginx
server_name macedonia-regions.com www.macedonia-regions.com;
```

Restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 9. Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d macedonia-regions.com -d www.macedonia-regions.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended: option 2)
```

**Auto-renewal is configured automatically!**

Test renewal:
```bash
sudo certbot renew --dry-run
```

**Update .env NEXTAUTH_URL:**
```bash
nano ~/macedonia-regions/.env
# Change: NEXTAUTH_URL=https://macedonia-regions.com

# Restart app
docker compose restart
```

---

## 10. Auto-restart on Server Reboot

```bash
# Create systemd service
sudo nano /etc/systemd/system/macedonia-regions.service
```

Paste:
```ini
[Unit]
Description=Macedonia Regions Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/macedonia-regions
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable macedonia-regions
sudo systemctl start macedonia-regions
sudo systemctl status macedonia-regions
```

---

## 11. Monitoring & Maintenance

### View Logs
```bash
# Application logs
cd ~/macedonia-regions
docker compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u macedonia-regions -f
```

### Update Application
```bash
cd ~/macedonia-regions
git pull
docker compose down
docker compose up -d --build
```

### Check Resources
```bash
# Disk usage
df -h

# Memory usage
free -h

# Docker stats
docker stats

# System info
htop  # Install: sudo apt install htop
```

### Backup Important Data
```bash
# Backup .env file
cp ~/macedonia-regions/.env ~/macedonia-env-backup

# Export database (if using local PostgreSQL)
# (You're using Neon, so DB is already backed up)
```

---

## 12. Cost Monitoring (Stay in Free Tier)

### Check Your Usage

1. Login to Oracle Cloud Console
2. Click **☰ Menu** → **Billing & Cost Management**
3. View **Cost Analysis**

**Free Tier Limits:**
- 2 AMD VMs (1/8 OCPU, 1GB RAM each)
- OR 1-4 ARM VMs (total: 4 OCPU, 24GB RAM)
- 200GB Block Storage
- 10TB outbound transfer/month

**Stay Free:**
- ✅ Use only Ampere A1 (ARM) shapes
- ✅ Stay within 4 OCPU + 24GB RAM total
- ✅ Monitor bandwidth (10TB is generous)
- ❌ Don't add paid services
- ❌ Don't upgrade shapes beyond free tier

---

## 13. Security Best Practices

```bash
# Change SSH port (optional, more security)
sudo nano /etc/ssh/sshd_config
# Change: Port 22 → Port 2222
sudo systemctl restart ssh
# Update firewall: sudo ufw allow 2222/tcp

# Setup fail2ban (auto-ban failed SSH attempts)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Regular updates
sudo apt update && sudo apt upgrade -y

# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Troubleshooting

### Issue: Can't SSH into server

```bash
# Check if instance is running in Oracle Console
# Check Security List has port 22 open (source: 0.0.0.0/0)
# Verify key permissions: chmod 400 oracle-vm-key.key
```

### Issue: Can't access website

```bash
# On server, check if Docker is running
docker compose ps

# Check if port 3000 is listening
sudo netstat -tulpn | grep 3000

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check Oracle Cloud Security List has port 80/443 open
# Check UFW firewall: sudo ufw status
```

### Issue: Out of memory

```bash
# Check memory
free -h

# If using 2GB VM, consider:
# - Reducing Docker container memory
# - Using swap file
# - Upgrading to 4 OCPU + 24GB (still free!)
```

---

## Next Steps

1. ✅ **Deploy and test** your application
2. 📊 **Collect performance metrics** for thesis
3. 🚀 **Set up CI/CD** for automatic deployments
4. 📈 **Monitor** usage and optimize
5. 🎓 **Document** findings for thesis comparison

**Your app is now live on Oracle Cloud Free Tier - forever!** 🎉

---

**Support:**
- Oracle Cloud Docs: https://docs.oracle.com/
- Community: https://community.oracle.com/
- Your thesis advisor 😊
