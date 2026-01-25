# Bachelor Thesis Plan: Next.js Application Development and Deployment Strategies Comparison

## Thesis Title (Working)

**"Comparative Analysis of Deployment Strategies for Next.js Web Applications"**

---

## 1. Introduction

### 1.1 Background and Motivation

- Rise of modern web frameworks (React, Next.js)
- Importance of deployment strategies in modern web development
- The complexity of choosing the right deployment approach

### 1.2 Problem Statement

- How do different deployment strategies affect application performance, cost, and maintainability?
- What are the trade-offs between various deployment options for Next.js applications?

### 1.3 Research Goals

1. Develop a functional Next.js application showcasing various features
2. Deploy the same application using multiple deployment strategies
3. Compare and analyze each deployment approach
4. Provide recommendations based on use cases

### 1.4 Scope and Limitations

- Focus on Next.js 14+ with App Router
- Deployment platforms: Vercel, AWS, Docker/Self-hosted, Netlify
- Metrics: Performance, Cost, Scalability, Developer Experience

---

## 2. Theoretical Background

### 2.1 Next.js Framework Overview

- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- Client-Side Rendering (CSR)
- Server Components vs Client Components
- App Router architecture

### 2.2 Deployment Concepts

- Platform as a Service (PaaS)
- Infrastructure as a Service (IaaS)
- Containerization (Docker)
- Serverless architecture
- Edge computing
- CDN and caching strategies

### 2.3 Key Metrics for Comparison

- Performance (TTFB, LCP, FID, CLS)
- Cost analysis (fixed vs variable pricing)
- Scalability options
- Developer experience and CI/CD
- Maintenance overhead

---

## 3. Application Development

### 3.1 Application Concept

**App: Macedonia Regions Visited Tracker**

A web application where users can track and visualize regions in Macedonia they have visited, similar to a scratch map.

- Interactive Macedonia map with clickable municipalities (80 regions)
- User profiles with travel statistics
- Public/private map sharing
- Visit history with timestamps, notes, ratings
- Admin region editor (UI for region data)

### 3.2 Technical Stack (Current)

| Component          | Technology               | Reason                                        |
| ------------------ | ------------------------ | --------------------------------------------- |
| **Framework**      | Next.js 16.0.10 (App Router) | SSR, SSG, Server Components, Turbopack     |
| **Language**       | TypeScript 5             | Type safety                                   |
| **Styling**        | Tailwind CSS v4          | Utility-first, fast                           |
| **UI Components**  | shadcn/ui (Radix UI)     | Pre-built, accessible components              |
| **Map Library**    | amCharts 5               | Interactive SVG maps, Macedonia geodata       |
| **Database**       | Neon (PostgreSQL)        | Serverless, works on all platforms            |
| **ORM**            | Drizzle ORM              | Type-safe, lightweight, SQL-like              |
| **Authentication** | Auth.js (NextAuth v5 beta) | Platform-agnostic, JWT sessions             |
| **Image Storage**  | Cloudflare R2 (S3-compatible) | Object storage for region images         |
| **Animations**     | Motion (CSS fallback)    | Smooth UI transitions                         |
| **Analytics**      | Vercel Speed Insights    | Performance monitoring                        |

### 3.3 Database Schema (Current)

```
┌───────────────┐     ┌────────────────────┐     ┌─────────────────┐
│    users      │     │    userVisits      │     │    regions      │
├───────────────┤     ├────────────────────┤     ├─────────────────┤
│ id (PK)       │────<│ userId (FK)        │     │ id (PK)         │
│ email         │     │ regionCode (FK)    │>────│ code (unique)   │
│ name          │     │ visitedAt          │     │ name            │
│ createdAt     │     │ notes              │     │ population      │
│ ...           │     │ rating             │     │ ...             │
└───────────────┘     └────────────────────┘     └─────────────────┘
```

- `regions` table uses a unique `code` (e.g. `mk-67`) matching geodata
- All region lookups and user visits use this code for consistency
- Region names in DB now match geodata (e.g. "Čučer Sandevo")
- Admin UI allows editing region data

### 3.4 Application Features (Current)

- [x] Interactive Macedonia map (amCharts 5)
- [x] User authentication (Auth.js/NextAuth v5)
- [x] User dashboard with travel stats
- [x] Region details pages (`/regions/[code]`)
- [x] Admin region editor (UI)
- [x] Image upload for regions (Cloudflare R2 + AWS SDK)
- [x] Public user profiles
- [x] CRUD for visits (API routes)
- [x] Mobile responsive UI
- [x] Leaderboard and statistics
- [x] Floating navbar with scroll behavior (CSS-based)
- [x] All region names and codes normalized to geodata
- [x] Database and API use region codes directly
- [x] All region hover cards work (including Čučer Sandevo)
- [x] Macedonia logo favicon
- [x] Vercel Speed Insights integration
- [x] Login button on homepage when not authenticated
- [x] Save progress requires authentication

### 3.5 Development Milestones (Updated)

- [x] Project setup and configuration
- [x] UI components (shadcn/ui)
- [x] Interactive map (amCharts 5)
- [x] Floating navbar
- [x] Login/Signup page UI
- [x] Database schema (Drizzle + Neon)
- [x] Authentication (Auth.js)
- [x] Server Actions for visits
- [x] User dashboard
- [x] Admin region editor
- [x] Image upload (R2)
- [x] Region hover cards (all regions)
- [x] Testing and optimization

---

## 4. Deployment Strategies

### 4.1 Completed Deployments

#### ✅ Vercel (PaaS - Serverless/Edge)
- **Status:** Deployed and running
- **URL:** Production deployment on Vercel
- **Features:** Edge runtime, automatic CDN, instant rollbacks
- **Cost:** Free tier (Hobby plan)
- **Deployment time:** ~2 minutes

#### ✅ Docker/Self-Hosted - DigitalOcean VPS
- **Status:** Deployed and running
- **URL:** http://164.92.240.237
- **Setup:** Docker Compose on Ubuntu 24.04 droplet
- **Specs:** 2GB RAM, 2 vCPUs, 50GB SSD
- **Features:** Nginx reverse proxy, auto-restart on reboot
- **Cost:** $12/month
- **Deployment time:** ~60 minutes (initial setup)
- **Image size:** 309MB (74.6MB compressed)

#### ✅ Kubernetes - DigitalOcean Managed K8s (DOKS)
- **Status:** Deployed and running
- **URL:** http://129.212.195.70
- **Setup:** 2-node cluster with LoadBalancer
- **Specs:** 2 nodes × (2GB RAM, 1 vCPU)
- **Features:** Auto-scaling (HPA), rolling updates, health checks
- **Registry:** DigitalOcean Container Registry
- **Cost:** $36/month (2 × $18/month nodes)
- **Deployment time:** ~30 minutes (after Docker image ready)

### 4.2 Planned Deployments

#### ❌ Deno Deploy (Edge Platform) - ABANDONED
- **Status:** Attempted but failed
- **Issue:** Free tier (3GB RAM) insufficient for npm install
- **Details:** 680+ packages with large dependencies (@amcharts, @aws-sdk, Next.js)
- **Failure point:** Exit code 137 (OOM) at ~40% package installation
- **Reason for abandonment:** Platform constraints incompatible with full-stack Next.js apps
- **Notes:** 
  - Attempted optimizations: removed AWS SDK (-98 packages), removed Motion library
  - Still failed at ~227/582 packages during install
  - Not a memory leak, just heavy dependencies + limited build environment
  - npm authentication errors also encountered

#### 🔄 AWS Amplify (PaaS - Serverless)
- **Next deployment:** Planned
- **Features:** Git-based deployment, auto-scaling, CDN
- **Expected cost:** ~$15-30/month

#### 📋 Future Considerations
- Netlify (static export comparison)
- AWS ECS Fargate (serverless containers)
- Railway/Render (alternative PaaS platforms)
- Note: Deno Deploy unsuitable for complex Next.js apps

---

## 5. Comparison Methodology

- Performance: Lighthouse, WebPageTest, load testing
- Cost: Free tier, scaling, hidden costs
- Developer Experience: CI/CD, rollback, logging
- Scalability: auto-scaling, geo-distribution, cold starts

---

## 6. Results & Recommendations

- Comparison matrix (criteria: setup, performance, cost, scalability, DX)
- Use case recommendations (startup, enterprise, budget, control)

---

## 7. Thesis Structure

1. Introduction
2. Theoretical Background
3. Application Development
4. Deployment Implementation
5. Comparative Analysis
6. Conclusion and Recommendations
7. References
8. Appendices

---

## 8. Timeline

### Completed Phases

- ✅ **Phase 1: Research & Planning** (Weeks 1-2)
  - Application concept defined
  - Technology stack selected
  - Deployment platforms identified

- ✅ **Phase 2: Application Development** (Weeks 3-6)
  - Next.js app with all core features
  - Database schema and ORM setup
  - Authentication system
  - Admin UI and region management
  - Image upload (Cloudflare R2)
  - All 80 regions mapped and functional

- ✅ **Phase 3: Deployment Implementation** (Weeks 7-8)
  - Vercel deployment (serverless baseline)
  - Docker containerization and optimization
  - DigitalOcean VPS deployment with Nginx
  - DigitalOcean Kubernetes cluster deployment
  - Container registry setup

### In Progress

- 🔄 **Phase 3 (Continued):** AWS Amplify deployment

### Remaining Phases

- 📋 **Phase 4: Testing & Analysis** (Weeks 9-10)
  - Performance benchmarking (Lighthouse, load tests)
  - Cost analysis and projections
  - Scalability testing
  - Developer experience comparison

- 📋 **Phase 5: Writing & Finalization** (Weeks 11-14)
  - Comparative analysis chapter
  - Results documentation
  - Recommendations and conclusions
  - Thesis review and defense preparation

---

## 9. Resources & References

- Next.js, Vercel, AWS, Docker, Drizzle, Auth.js, Neon docs
- Tools: VS Code, GitHub, Postman, Lighthouse CI, Drizzle Studio
- Academic: IEEE, ACM, web/cloud research

---

## 10. Notes & Ideas

### Recent Updates (January 2026)
- All region names/codes now match geodata (no hover card bugs)
- Admin UI for region data working
- R2 for image storage via AWS SDK S3-compatible API
- Multi-platform DB connection (Neon) works across all deployments
- Vercel Speed Insights integrated for performance monitoring
- Macedonia logo added as favicon
- Next.js 16 with Turbopack (default) for faster builds
- Motion library replaced with CSS transitions for navbar
- Deno Deploy attempted but abandoned due to platform limitations
- Package count: ~680 dependencies (typical for full-stack Next.js)

### Deployment Lessons Learned
- **Vercel**: Best DX, instant deploys, optimal for Next.js
- **Docker/VPS**: Full control, predictable costs, requires maintenance
- **Kubernetes**: Production-grade, overkill for small apps, higher costs
- **Deno Deploy**: Great for lightweight apps, incompatible with heavy dependencies

### Future Work Considerations
- Consider real-time features (WebSockets/Server-Sent Events)
- Progressive Web App (PWA) capabilities
- Offline support for visited regions
- Social features (share maps, challenges)
- Performance: Image optimization, lazy loading improvements

---

_Last Updated: January 25, 2026_
