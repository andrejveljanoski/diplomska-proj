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

**Proposed App: Scratch Map / Visited Places Tracker (Macedonia)**

A web application where users can track and visualize regions in Macedonia they have visited, similar to a physical scratch map.

- Interactive Macedonia map with clickable municipalities (80 regions)
- User profiles with personal travel statistics
- Public/private map sharing
- Travel goals and bucket list features
- Visit history with timestamps, notes, ratings

### 3.2 Technical Stack

| Component          | Technology               | Reason                                        |
| ------------------ | ------------------------ | --------------------------------------------- |
| **Framework**      | Next.js 14+ (App Router) | SSR, SSG, Server Components                   |
| **Language**       | TypeScript               | Type safety                                   |
| **Styling**        | Tailwind CSS v4          | Utility-first, fast                           |
| **UI Components**  | shadcn/ui                | Pre-built, customizable                       |
| **Map Library**    | amCharts 5               | Interactive SVG maps, North Macedonia geodata |
| **Database**       | Neon (PostgreSQL)        | Serverless, works on all platforms            |
| **ORM**            | Drizzle ORM              | Type-safe, lightweight, SQL-like              |
| **Authentication** | Auth.js (NextAuth v5)    | Platform-agnostic, JWT sessions               |
| **Animations**     | Framer Motion            | Smooth UI transitions                         |

### 3.3 Database Schema

```
┌─────────────────┐     ┌────────────────────┐     ┌─────────────────┐
│     users       │     │    userVisits      │     │    regions      │
├─────────────────┤     ├────────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ userId (FK)        │     │ id (PK)         │
│ email           │     │ regionCode (FK)    │>────│ code (unique)   │
│ password        │     │ visitedAt          │     │ name            │
│ name            │     │ notes              │     │ population      │
│ createdAt       │     │ rating             │     │ area            │
└─────────────────┘     └────────────────────┘     └─────────────────┘
```

**Key Relationships (Updated):**

- User HAS MANY visits
- Region HAS MANY visits
- Visit BELONGS TO User and Region (by regionCode)

**Schema/Backend Improvements:**

- `regions` table now has a unique `code` field (e.g. `skopje`, `bitola`), used as a stable identifier and foreign key
- `userVisits` references `regionCode` (not numeric id)
- All API and map logic now uses region codes directly (no mapping needed)
- Database and API are simpler, more robust, and easier to maintain

**Example Queries (Unchanged):**

- Get user's visited regions (JOIN userVisits + regions ON regionCode)
- Calculate user progress (visited / total regions)
- Leaderboard (GROUP BY userId, COUNT visits)
- Region statistics (most visited, least visited)

### 3.4 Application Features

1. **Homepage/Landing** - Interactive Macedonia map, marketing content
2. **Interactive Map View** - Click to mark regions as visited (amCharts 5)
3. **User Dashboard** - Travel statistics, progress bar, recent visits
4. **Region Details** - Dynamic routes (`/region/[code]`), SSR
5. **User Profiles** - Public shareable maps
6. **Authentication** - Email/password + OAuth (Google, GitHub)
7. **API Routes / Server Actions** - CRUD for visits
8. **Admin Panel** - User management, analytics

### 3.5 Why SQL over NoSQL

| Requirement                | SQL (PostgreSQL) | NoSQL (MongoDB) |
| -------------------------- | ---------------- | --------------- |
| User → Visits → Regions    | ✅ JOINs         | ⚠️ Denormalized |
| "Users who visited Skopje" | ✅ Simple JOIN   | ⚠️ Aggregation  |
| Statistics (COUNT, AVG)    | ✅ Built-in      | ⚠️ Complex      |
| Data integrity             | ✅ Foreign keys  | ❌ None         |

### 3.6 Development Milestones

- [x] Project setup and configuration
- [x] UI components (shadcn/ui)
- [x] Interactive map (amCharts 5)
- [x] Floating navbar
- [x] Login/Signup page UI
- [ ] Database schema (Drizzle + Neon)
- [ ] Authentication (Auth.js)
- [ ] Server Actions for visits
- [ ] User dashboard
- [ ] Testing and optimization

---

## 4. Deployment Strategies

### 4.1 Vercel (Platform as a Service)

- Native Next.js deployment
- Edge Functions
- Serverless functions
- Analytics and monitoring
- Preview deployments

### 4.2 AWS Deployment Options

- **AWS Amplify** - Managed hosting
- **EC2 + Load Balancer** - Traditional server
- **ECS/Fargate** - Container orchestration
- **Lambda@Edge** - Serverless edge deployment

### 4.3 Docker/Self-Hosted

- Docker containerization
- Docker Compose setup
- VPS deployment (DigitalOcean, Linode)
- Kubernetes (optional advanced)

### 4.4 Netlify

- Static export deployment
- Serverless functions
- Edge functions comparison with Vercel

### 4.5 Other Options (Brief Overview)

- Railway
- Render
- Fly.io

---

## 5. Comparison Methodology

### 5.1 Performance Testing

- Lighthouse scores
- WebPageTest analysis
- Load testing (k6, Artillery)
- Real User Monitoring (RUM)

### 5.2 Cost Analysis

- Free tier limitations
- Scaling costs estimation
- Hidden costs (bandwidth, functions, etc.)

### 5.3 Developer Experience

- Deployment ease
- CI/CD integration
- Rollback capabilities
- Logging and debugging

### 5.4 Scalability Assessment

- Auto-scaling capabilities
- Geographic distribution
- Cold start analysis

---

## 6. Expected Results Structure

### 6.1 Comparison Matrix

| Criteria            | Vercel | AWS Amplify | AWS EC2 | Docker/VPS | Netlify |
| ------------------- | ------ | ----------- | ------- | ---------- | ------- |
| Setup Complexity    |        |             |         |            |         |
| Performance         |        |             |         |            |         |
| Cost (Low Traffic)  |        |             |         |            |         |
| Cost (High Traffic) |        |             |         |            |         |
| Scalability         |        |             |         |            |         |
| DX Score            |        |             |         |            |         |

### 6.2 Use Case Recommendations

- Best for startups/MVPs
- Best for enterprise
- Best for budget-conscious
- Best for maximum control

---

## 7. Thesis Structure

1. **Introduction** (5-10 pages)
2. **Theoretical Background** (15-20 pages)
3. **Application Development** (15-20 pages)
4. **Deployment Implementation** (20-25 pages)
5. **Comparative Analysis** (15-20 pages)
6. **Conclusion and Recommendations** (5-10 pages)
7. **References**
8. **Appendices** (Code samples, configurations)

---

## 8. Timeline

### Phase 1: Research & Planning (Weeks 1-2)

- Literature review
- Define application requirements
- Set up development environment

### Phase 2: Application Development (Weeks 3-6)

- Core functionality implementation
- Database and authentication
- Testing and optimization

### Phase 3: Deployment Implementation (Weeks 7-10)

- Deploy to each platform
- Configure CI/CD pipelines
- Document each process

### Phase 4: Testing & Analysis (Weeks 11-13)

- Performance benchmarking
- Cost analysis
- Data collection

### Phase 5: Writing & Finalization (Weeks 14-16)

- Write thesis document
- Create visualizations
- Review and revisions

---

## 9. Resources & References

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Auth.js Documentation](https://authjs.dev/)
- [Neon Documentation](https://neon.tech/docs)

### Tools

- VS Code
- Git/GitHub
- Postman/Insomnia
- Lighthouse CI
- Drizzle Studio

### Academic Resources

- IEEE, ACM Digital Library
- Research papers on web performance
- Cloud computing comparative studies

---

## 10. Notes & Ideas

- Consider adding real-time features (WebSockets) to test serverless limitations
- Include environment variables management comparison
- Document database connection handling differences
- Consider multi-region deployment testing
- Same Neon database connection works across all deployment platforms (fair comparison)

---

_Last Updated: November 29, 2025_
