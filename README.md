# Hand Talk - Web Accessibility Analyzer

A full-stack application for analyzing website accessibility, built as part of the Hand Talk Full Stack Developer III technical challenge.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Architectural Decisions](#architectural-decisions)
- [Design Patterns](#design-patterns)
- [Trade-offs and Improvements](#trade-offs-and-improvements)
- [AWS Production Deploy Strategy](#aws-production-deploy-strategy)
- [Scalability Discussion](#scalability-discussion)

---

## Overview

This application allows users to submit a URL for basic accessibility analysis. It checks for:

- **Title tag**: Verifies if `<title>` exists and is not empty
- **Image alt attributes**: Counts images and identifies those missing `alt` attributes
- **Input/Label associations**: Checks if form inputs have properly associated labels

The results are persisted in MongoDB and displayed in a user-friendly interface.

---

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Socket.io** - Real-time WebSocket communication
- **Cheerio** - HTML parsing for accessibility analysis
- **Zod** - Runtime validation
- **Vitest** - Testing framework

### Frontend
- **Vue.js 3** with **TypeScript**
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Bootstrap 5** - UI framework
- **Socket.io-client** - WebSocket client
- **Axios** - HTTP client
- **Vitest** - Testing framework

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** - CI/CD pipeline

---

## Project Structure

```
handtalk-accessibility-analyzer/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API route definitions
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── services/        # Business logic
│   │   ├── socket/          # WebSocket handlers
│   │   ├── types/           # TypeScript interfaces
│   │   └── index.ts         # Application entry point
│   ├── tests/               # Unit tests
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # API and Socket services
│   │   ├── router/          # Vue Router config
│   │   ├── types/           # TypeScript interfaces
│   │   └── main.ts          # Application entry point
│   ├── Dockerfile
│   └── package.json
├── scripts/                 # Automation scripts
├── .github/workflows/       # CI/CD pipeline
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Docker)
- npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/handtalk-accessibility-analyzer.git
cd handtalk-accessibility-analyzer
```

2. **Run the setup script**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Or manually:

```bash
# Install backend dependencies
cd backend
npm install
cp .env.example .env

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env
```

3. **Start MongoDB** (if not using Docker)
```bash
mongod
```

4. **Start the development servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## Running with Docker

The easiest way to run the entire application:

```bash
docker compose up
```

This will start:
- MongoDB on port 27017
- Backend API on port 3000
- Frontend on port 8080

Access the application at http://localhost:8080

---

## API Documentation

### POST /api/analyze

Analyzes a URL for accessibility issues.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "id": "64abc123...",
  "url": "https://example.com",
  "result": {
    "title": {
      "exists": true,
      "content": "Example Domain",
      "isEmpty": false
    },
    "images": {
      "total": 5,
      "withoutAlt": 2,
      "missingAltImages": ["img1.jpg", "img2.jpg"]
    },
    "inputs": {
      "total": 3,
      "withoutLabel": 1,
      "inputsWithoutLabel": ["search-input"]
    },
    "score": 33,
    "passedChecks": 1,
    "totalChecks": 3
  },
  "analyzedAt": "2024-01-01T12:00:00.000Z",
  "duration": 1500
}
```

### GET /api/history

Returns paginated history of analyses.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10, max: 100)

**Response:**
```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### GET /api/analysis/:id

Returns a specific analysis by ID.

---

## Architectural Decisions

### Backend Architecture: Layered Architecture

The backend follows a **layered architecture** pattern, separating concerns into distinct layers:

```
Routes → Controllers → Services → Repositories → Database
```

**Why this approach:**

1. **Separation of Concerns**: Each layer has a single responsibility
   - Routes: Define API endpoints
   - Controllers: Handle HTTP requests/responses
   - Services: Contain business logic
   - Repositories: Abstract data access

2. **Testability**: Each layer can be tested in isolation with mocked dependencies

3. **Maintainability**: Changes in one layer don't affect others (e.g., switching from MongoDB to PostgreSQL only requires changing the repository layer)

4. **Scalability**: Easy to add new features without modifying existing code

### Frontend Architecture: Component-Based with Centralized State

The frontend uses Vue 3's Composition API with Pinia for state management:

- **Components**: Presentational, reusable UI elements
- **Views**: Page-level components connected to the router
- **Stores**: Centralized state management with Pinia
- **Services**: API communication layer

**Why Pinia:**
- Official Vue 3 state management solution
- Full TypeScript support with type inference
- Simpler API compared to Vuex
- DevTools integration

---

## Design Patterns

### 1. Repository Pattern (Backend)

The `AnalysisRepository` abstracts all database operations, providing a clean interface for data access:

```typescript
class AnalysisRepository {
  async create(url: string, result: AccessibilityResult, duration: number): Promise<IAnalysis>
  async findById(id: string): Promise<IAnalysis | null>
  async findAll(page: number, limit: number): Promise<PaginatedResult<IAnalysis>>
}
```

**Benefits:**
- Decouples business logic from data persistence
- Easy to mock in tests
- Simplifies switching databases

### 2. Service Pattern (Backend)

Business logic is encapsulated in services:

- `AccessibilityService`: Performs HTML analysis
- `HtmlFetcherService`: Fetches HTML content from URLs

**Benefits:**
- Single Responsibility Principle
- Reusable across different controllers
- Easier unit testing

### 3. Singleton Pattern (Backend Services)

Services are exported as singleton instances:

```typescript
export default new AccessibilityService();
```

**Benefits:**
- Single instance throughout the application
- Consistent state
- Reduced memory usage

### 4. Observer Pattern (WebSocket)

Socket.io implements the Observer pattern for real-time updates:

- Server emits progress events
- Clients subscribe and react to updates

### 5. Store Pattern (Frontend)

Pinia stores centralize state and actions:

```typescript
export const useAnalysisStore = defineStore('analysis', () => {
  const currentAnalysis = ref<AnalysisResponse | null>(null);
  const isLoading = ref(false);

  async function analyze(url: string) { ... }

  return { currentAnalysis, isLoading, analyze };
});
```

---

## Trade-offs and Improvements

### Trade-offs Made

1. **Cheerio vs Puppeteer/Playwright**
   - **Choice**: Cheerio for HTML parsing
   - **Trade-off**: Cannot execute JavaScript, so SPAs aren't fully analyzed
   - **Reason**: Simpler, faster, lower resource usage for basic HTML analysis

2. **MongoDB vs PostgreSQL**
   - **Choice**: MongoDB
   - **Trade-off**: Less strict schema, no complex joins
   - **Reason**: Flexible document structure fits accessibility results well, required by challenge

3. **Bootstrap vs Custom CSS**
   - **Choice**: Bootstrap 5
   - **Trade-off**: Larger bundle size, less customization
   - **Reason**: Faster development, built-in accessibility features, responsive by default

4. **Monorepo without tools like Turborepo/Nx**
   - **Choice**: Simple npm workspaces
   - **Trade-off**: No advanced caching or task orchestration
   - **Reason**: Simpler setup for a small project

### Improvements with More Time

1. **Enhanced Accessibility Analysis**
   - Add more WCAG checks (color contrast, heading hierarchy, ARIA usage)
   - Integrate with axe-core or pa11y for comprehensive analysis
   - Support for JavaScript-rendered pages using Puppeteer

2. **User Authentication**
   - User accounts to track personal analysis history
   - Rate limiting per user

3. **Advanced Features**
   - Scheduled periodic analysis of URLs
   - PDF report generation
   - Comparison between analyses over time
   - Batch URL analysis

4. **Performance Optimizations**
   - Redis caching for repeated URL analyses
   - Queue system for heavy analysis tasks
   - CDN for frontend assets

5. **Better Testing**
   - E2E tests with Cypress or Playwright
   - Higher test coverage
   - Integration tests with test database

---

## AWS Production Deploy Strategy

### Architecture Overview

```
                    ┌─────────────────┐
                    │   CloudFront    │
                    │     (CDN)       │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼─────────┐       ┌──────────▼──────────┐
    │        S3         │       │   Application       │
    │    (Frontend)     │       │   Load Balancer     │
    └───────────────────┘       └──────────┬──────────┘
                                           │
                                ┌──────────▼──────────┐
                                │    ECS Fargate      │
                                │    (Backend)        │
                                └──────────┬──────────┘
                                           │
                         ┌─────────────────┴─────────────────┐
                         │                                   │
               ┌─────────▼─────────┐             ┌──────────▼──────────┐
               │  DocumentDB or    │             │    ElastiCache      │
               │  MongoDB Atlas    │             │      (Redis)        │
               └───────────────────┘             └─────────────────────┘
```

### Services and Justifications

#### Frontend: S3 + CloudFront

- **S3**: Host static Vue.js build files
  - Low cost, highly durable (99.999999999%)
  - No server management required

- **CloudFront**: CDN for global distribution
  - Low latency for users worldwide
  - HTTPS with AWS Certificate Manager
  - Cache static assets at edge locations

#### Backend: ECS Fargate

- **Why ECS Fargate over EC2:**
  - Serverless containers - no infrastructure management
  - Auto-scaling based on demand
  - Pay only for resources used
  - Easy Docker deployment

- **Why not Lambda:**
  - WebSocket connections require persistent connections
  - Lambda has cold start issues
  - More complex for this use case

#### Database: DocumentDB or MongoDB Atlas

- **DocumentDB** (AWS managed MongoDB-compatible):
  - Fully managed, auto-scaling storage
  - Automatic backups and recovery
  - VPC integration for security

- **MongoDB Atlas** (alternative):
  - True MongoDB compatibility
  - Global clusters option
  - Free tier available for development

#### Cache: ElastiCache (Redis)

- Cache frequent URL analyses
- Store session data
- Rate limiting implementation

### Deployment Pipeline

1. Push to main branch triggers GitHub Actions
2. Run tests and build Docker images
3. Push images to ECR (Elastic Container Registry)
4. Update ECS service with new image
5. Deploy frontend to S3 and invalidate CloudFront cache

---

## Scalability Discussion

### Challenge: 100,000 Analyses per Day

That's approximately:
- ~4,167 analyses per hour
- ~70 analyses per minute
- ~1.2 analyses per second (average)

### Current Architecture Bottlenecks

1. **Synchronous Analysis**
   - Each request waits for URL fetch + analysis to complete
   - Blocks resources during slow external URL fetches

2. **Single Database Instance**
   - Write-heavy workload could overwhelm single instance
   - No read replicas for history queries

3. **No Caching**
   - Repeated analysis of same URLs wastes resources

4. **Memory Constraints**
   - HTML parsing is memory-intensive for large pages

### Evolved Architecture for Scale

```
                         ┌─────────────────┐
                         │   API Gateway   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
          ┌─────────▼─────────┐     ┌──────────▼──────────┐
          │   Analysis API    │     │    Results API      │
          │   (Submit URLs)   │     │  (Query History)    │
          └─────────┬─────────┘     └──────────┬──────────┘
                    │                          │
          ┌─────────▼─────────┐     ┌──────────▼──────────┐
          │       SQS         │     │    ElastiCache      │
          │  (Job Queue)      │     │      (Redis)        │
          └─────────┬─────────┘     └──────────┬──────────┘
                    │                          │
          ┌─────────▼─────────┐     ┌──────────▼──────────┐
          │  Worker Fleet     │     │  DocumentDB Cluster │
          │  (ECS/Lambda)     │     │  (with replicas)    │
          └───────────────────┘     └─────────────────────┘
```

### Solutions

#### 1. Asynchronous Processing with SQS

```
User submits URL → API returns job ID → SQS queue → Workers process → WebSocket notifies completion
```

**Benefits:**
- Non-blocking API responses
- Automatic retry for failed jobs
- Smooth handling of traffic spikes

#### 2. Worker Fleet with Auto-Scaling

- **ECS Fargate** workers that scale based on queue depth
- Or **Lambda** for truly serverless processing (for non-WebSocket scenarios)
- Process multiple analyses in parallel

#### 3. Redis Caching Layer

```typescript
async function analyzeWithCache(url: string): Promise<AnalysisResult> {
  const cached = await redis.get(`analysis:${url}`);
  if (cached) return JSON.parse(cached);

  const result = await performAnalysis(url);
  await redis.setex(`analysis:${url}`, 3600, JSON.stringify(result)); // 1 hour TTL

  return result;
}
```

**Benefits:**
- Avoid re-analyzing same URLs within TTL
- Reduce database writes
- Faster response times

#### 4. Database Scaling

- **DocumentDB with Read Replicas**: Separate read/write traffic
- **Sharding**: Partition data by URL hash for horizontal scaling
- **Time-based archiving**: Move old analyses to cold storage (S3 + Athena)

#### 5. Microservices Split

- **Analysis Service**: Handles URL fetching and analysis
- **Results Service**: Handles queries and history
- **Notification Service**: Manages WebSocket connections

**Benefits:**
- Independent scaling of each service
- Isolated failures
- Technology flexibility per service

### Estimated Infrastructure for 100k/day

| Component | Configuration | Estimated Cost/Month |
|-----------|--------------|---------------------|
| ECS Fargate (API) | 2 tasks, 0.5 vCPU, 1GB | ~$30 |
| ECS Fargate (Workers) | 4-10 tasks (auto-scale) | ~$100-250 |
| DocumentDB | db.r5.large | ~$200 |
| ElastiCache Redis | cache.t3.small | ~$25 |
| SQS | ~3M requests | ~$1 |
| S3 + CloudFront | Static hosting | ~$10 |
| **Total** | | **~$370-520** |

---

## Running Tests

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# Run all tests
npm run test  # from root (if configured)
```

---

## License

This project was created as part of a technical challenge for Hand Talk.
