# Quick Reference for DigitalOcean Deployment

## Your Droplet Details

**IP Address:** `164.92.240.237`

**SSH Connection:**
```bash
ssh root@164.92.240.237
# Or if using deployer user:
ssh deployer@164.92.240.237
```

## Quick Commands

### Connect to Server
```bash
ssh deployer@164.92.240.237
```

### Deploy Application
```bash
# On server
cd ~/apps/macedonia-regions
git pull
docker compose down
docker compose up -d --build
```

### View Logs
```bash
docker compose logs -f
```

### Access Your App
- **HTTP:** http://164.92.240.237
- **With Nginx (port 80):** http://164.92.240.237
- **Direct to app (port 3000):** http://164.92.240.237:3000

## Important Files on Server

**Application Directory:** `/home/deployer/apps/macedonia-regions/`

**Environment File:** `/home/deployer/apps/macedonia-regions/.env`

**Nginx Config:** `/etc/nginx/sites-available/macedonia-regions`

## Next Steps

1. ✅ Connect to server: `ssh root@164.92.240.237`
2. ⬜ Follow [DIGITALOCEAN_SETUP.md](DIGITALOCEAN_SETUP.md) from Section 4
3. ⬜ Install Docker
4. ⬜ Deploy your app
5. ⬜ Setup Nginx
6. ⬜ (Optional) Get domain and SSL certificate

## Monitoring

**DigitalOcean Dashboard:**
- https://cloud.digitalocean.com/droplets
- View CPU, Memory, Bandwidth graphs

**Server Resource Usage:**
```bash
# SSH into server
htop           # Press F10 to quit
docker stats   # Real-time container stats
df -h          # Disk usage
```

## Troubleshooting

**Can't connect via SSH?**
```bash
# Check if you have the right key
ssh -i C:\Users\andre\.ssh\id_ed25519 root@164.92.240.237
```

**App not accessible?**
```bash
# On server, check if running
docker compose ps
docker compose logs
```

**Need to restart app?**
```bash
docker compose restart
```

## Cost Tracking

**Current Plan:** $12/month Regular Droplet
- 2 GB RAM / 2 vCPUs
- 50 GB SSD
- 2 TB Transfer

**With $200 credit:** Runs for 16+ months free

**Monitor usage:** https://cloud.digitalocean.com/billing
