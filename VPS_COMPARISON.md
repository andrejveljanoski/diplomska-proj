# VPS Provider Comparison for Thesis Project

Quick comparison to help you choose the best VPS provider for deploying your Macedonia Regions app.

## 🏆 Quick Recommendations

| Your Priority | Recommended Provider | Why |
|--------------|---------------------|-----|
| **Free forever** | Oracle Cloud Free Tier | 4 vCPU + 24GB RAM, no time limit |
| **Easiest setup** | DigitalOcean | Best documentation, simple UI |
| **Learning K8s** | DigitalOcean Kubernetes | Managed K8s, $200 credit |
| **Best value (paid)** | Hetzner Cloud | €4.51/mo for 2 vCPU + 4GB RAM |
| **Enterprise learning** | AWS Free Tier | 12 months free, industry standard |
| **Thesis comparison** | Oracle + DigitalOcean | Free production + testing |

---

## 📊 Detailed Comparison

### 1. Oracle Cloud (Free Tier)

**Cost:** FREE FOREVER ✅

**Specs (Always Free):**
- ARM VM: Up to 4 OCPU, 24GB RAM
- Storage: 200GB
- Bandwidth: 10TB/month
- IPv4: Yes

**Pros:**
- ✅ Best free specs available
- ✅ No time limit
- ✅ Production-ready
- ✅ Perfect for long-term thesis demo

**Cons:**
- ❌ Complex signup (requires credit card verification)
- ❌ ARM architecture (still works with Node.js)
- ❌ UI can be confusing

**Best for:** Main production deployment, permanent demo site

**Setup Time:** 30-60 minutes

**Tutorial:** [ORACLE_CLOUD_SETUP.md](ORACLE_CLOUD_SETUP.md)

---

### 2. DigitalOcean

**Cost:**
- Regular: $200 credit for 60 days
- GitHub Student Pack: $200 credit for 12 months ⭐

**Specs ($12/month Droplet):**
- 2 vCPU
- 2GB RAM
- 50GB SSD
- 2TB bandwidth

**Pros:**
- ✅ Easiest to use
- ✅ Best documentation
- ✅ Great tutorials
- ✅ Managed Kubernetes available
- ✅ One-click apps

**Cons:**
- ❌ Costs money after credit
- ❌ More expensive than Hetzner

**Best for:** Learning, testing, Kubernetes deployment

**Setup Time:** 15-30 minutes

**How to Get Free Credits:**

1. **GitHub Student Pack (Best):**
   - Go to: https://education.github.com/pack
   - Verify student status (university email or ID)
   - Get $200 credit for 1 year
   
2. **Regular Signup:**
   - Go to: https://www.digitalocean.com/
   - Sign up with credit card
   - Get $200 credit for 60 days

**Credit Usage:**
- $200 credit = 16+ months of $12 droplet
- Or $200 credit = 40 months of $4 droplet

---

### 3. Hetzner Cloud

**Cost:**
- €20 initial credit (new accounts)
- €4.51/month after credit

**Specs (CX21 - €4.51/mo):**
- 2 vCPU
- 4GB RAM
- 40GB SSD
- 20TB bandwidth

**Pros:**
- ✅ Best price/performance ratio
- ✅ European servers (GDPR compliant)
- ✅ Simple interface
- ✅ Great for production

**Cons:**
- ❌ Limited free trial
- ❌ Fewer regions than AWS/GCP
- ❌ No managed Kubernetes (use k3s)

**Best for:** Long-term production after thesis (cheapest)

**Setup Time:** 20-30 minutes

**Signup:** https://www.hetzner.com/cloud

---

### 4. Google Cloud Platform (GCP)

**Cost:**
- $300 credit for 90 days
- Always Free: e2-micro (0.25 vCPU, 1GB RAM)

**Specs (e2-micro - Always Free):**
- 0.25-2 vCPU (burst)
- 1GB RAM
- 30GB HDD
- 1GB network egress/month

**Pros:**
- ✅ $300 trial credit
- ✅ Free tier continues after trial
- ✅ Excellent for Google Kubernetes Engine (GKE)
- ✅ Global infrastructure

**Cons:**
- ❌ Complex pricing
- ❌ Can accidentally incur charges
- ❌ Free tier VM is weak (1GB RAM)

**Best for:** Kubernetes testing, Google ecosystem learning

**Setup Time:** 45-90 minutes

---

### 5. AWS (Amazon Web Services)

**Cost:**
- 12 months free tier
- t2.micro: 750 hours/month free

**Specs (t2.micro - Free Tier):**
- 1 vCPU
- 1GB RAM
- 30GB EBS storage
- Limited bandwidth

**Pros:**
- ✅ Industry standard (great for resume)
- ✅ 12 months free
- ✅ Best documentation
- ✅ Most services available

**Cons:**
- ❌ Complex (steep learning curve)
- ❌ Easy to accidentally incur charges
- ❌ Low specs on free tier
- ❌ Complicated billing

**Best for:** Enterprise learning, resume building

**Setup Time:** 60-120 minutes

---

### 6. Linode (Akamai)

**Cost:**
- $100 credit for 60 days

**Specs ($12/month):**
- 2 vCPU
- 4GB RAM
- 80GB SSD
- 4TB bandwidth

**Pros:**
- ✅ Simple pricing
- ✅ Good performance
- ✅ Managed Kubernetes available

**Cons:**
- ❌ Smaller free trial than competitors
- ❌ Fewer regions

**Best for:** Alternative to DigitalOcean

**Setup Time:** 20-30 minutes

---

### 7. Azure (Microsoft)

**Cost:**
- $200 credit for 30 days
- 12 months free tier (B1S VM)

**Specs (B1S - Free Tier):**
- 1 vCPU
- 1GB RAM
- Limited bandwidth

**Pros:**
- ✅ 12 months free
- ✅ Good for .NET apps
- ✅ Enterprise features

**Cons:**
- ❌ Complex interface
- ❌ Low free tier specs
- ❌ Can be expensive

**Best for:** Microsoft stack, enterprise learning

**Setup Time:** 60-90 minutes

---

## 💡 My Recommendations for Your Thesis

### **Option A: Single Platform (Simplest)**

**Use: Oracle Cloud Free Tier**

**Why:**
- Free forever
- Great specs (4 vCPU, 24GB RAM)
- Deploy both Docker AND Kubernetes
- No ongoing costs

**Thesis Coverage:**
1. Deploy with Docker Compose on Oracle
2. Deploy with K3s (lightweight K8s) on same VM
3. Compare both on same hardware

---

### **Option B: Dual Platform (Best Comparison)**

**Primary: Oracle Cloud Free Tier**
- Production Docker deployment
- Cost: $0
- Long-term demo site

**Secondary: DigitalOcean (GitHub Student Pack)**
- Managed Kubernetes testing
- Cost: $0 (with student pack)
- Professional K8s experience

**Why:**
- Real-world comparison
- Docker (VPS) vs Kubernetes (managed)
- Two different cloud providers
- Total cost: $0

---

### **Option C: Triple Platform (Most Comprehensive)**

1. **Oracle Cloud** - Docker on VPS (Free)
2. **DigitalOcean** - Managed Kubernetes ($200 credit)
3. **Local Docker** - Development

**Thesis Sections:**
- Docker on self-managed VPS (Oracle)
- Kubernetes on managed platform (DO)
- Local development workflow
- Cost comparison
- Performance comparison

---

## 🎯 Step-by-Step: What to Do Now

### Week 1: Setup Oracle Cloud (Free)

1. ✅ Sign up for Oracle Cloud Free Tier
2. ✅ Create VM instance (2 OCPU, 12GB RAM)
3. ✅ Deploy with Docker Compose
4. ✅ Setup Nginx + SSL
5. ✅ Collect performance metrics

**Follow:** [ORACLE_CLOUD_SETUP.md](ORACLE_CLOUD_SETUP.md)

### Week 2: Setup DigitalOcean (Optional)

1. ✅ Apply for GitHub Student Pack
2. ✅ Create DigitalOcean account with $200 credit
3. ✅ Create Kubernetes cluster
4. ✅ Deploy with K8s manifests
5. ✅ Compare with Oracle deployment

### Week 3: Testing & Metrics

1. Load testing both deployments
2. Cost analysis
3. Performance comparison
4. Document findings

---

## 🆓 How to Get Free Credits

### GitHub Student Pack (Best!)

**Includes:**
- DigitalOcean: $200 credit for 12 months
- Azure: $100 credit
- Heroku: 1 year free dyno
- Namecheap: Free .me domain
- Many more developer tools

**How to Get:**
1. Go to: https://education.github.com/pack
2. Verify student status:
   - Upload university ID card or
   - Use university email (@student.ukim.edu.mk)
3. Wait 1-7 days for approval
4. Access all benefits

---

## 📊 Cost Comparison (After Free Trials)

| Provider | Monthly Cost | Specs |
|----------|-------------|-------|
| **Oracle** | **$0** | 4 vCPU, 24GB RAM ⭐ |
| Hetzner | €4.51 | 2 vCPU, 4GB RAM |
| DigitalOcean | $12 | 2 vCPU, 2GB RAM |
| Linode | $12 | 2 vCPU, 4GB RAM |
| AWS | ~$10-15 | 2 vCPU, 2GB RAM |
| GCP | $0 (free tier) | 0.25 vCPU, 1GB RAM |

---

## ✅ My Final Recommendation

**For your thesis, I recommend:**

### Primary Deployment: **Oracle Cloud Free Tier**
- **Why:** Free forever, great specs, perfect for long-term demo
- **Use for:** Main Docker deployment, permanent hosting
- **Setup:** [ORACLE_CLOUD_SETUP.md](ORACLE_CLOUD_SETUP.md)

### Secondary (Optional): **DigitalOcean with Student Pack**
- **Why:** Professional K8s experience, managed platform
- **Use for:** Kubernetes comparison, testing
- **Cost:** $0 with student pack

This gives you:
✅ Zero cost
✅ Real production experience
✅ Both Docker and Kubernetes deployments
✅ Solid thesis comparison data
✅ Long-term demo site for portfolio

---

## 🚀 Next Steps

1. **Read:** [ORACLE_CLOUD_SETUP.md](ORACLE_CLOUD_SETUP.md)
2. **Sign up:** Oracle Cloud Free Tier
3. **Deploy:** Your Docker application
4. **Optional:** Apply for GitHub Student Pack
5. **Document:** Everything for thesis!

Good luck with your deployment! 🎓
