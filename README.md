# Hypernode Automation Engine (HAE)

**Job Orchestration, Matchmaking & Agent Coordination for Hypernode**

The automation engine that powers the Hypernode network - intelligently matching jobs to nodes, listening to on-chain events, coordinating AI agents, and aggregating metrics.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

---

## 🎯 Overview

The Hypernode Automation Engine (HAE) is the brain of the network that:
- **Matches jobs to nodes** based on GPU specs, reputation, price
- **Listens to on-chain events** from Solana programs
- **Coordinates AI agents** (Eliza, Hyper Agent)
- **Aggregates network metrics** for the validation page
- **Sends webhooks** for external integrations
- **Manages job queue** and execution lifecycle

---

## ✨ Features

### Job Matchmaking
- Smart matching algorithm (GPU requirements, VRAM, capabilities)
- Reputation-based selection
- Price optimization
- Load balancing across nodes
- Fallback mechanisms

### Event Listening
- Monitor Solana blockchain for:
  - `NodeRegistered` events
  - `JobCreated` events
  - `JobCompleted` events
  - `PaymentDistributed` events
- Real-time indexing
- Event replay for missed blocks

### Agent Integration
- Eliza agent API
- Hyper Agent coordination
- Custom agent plugins
- Job orchestration via agents

### Metrics Aggregation
- Real-time network stats
- Historical data analysis
- Public validation page data
- Performance analytics

### Webhook System
- Discord notifications
- Slack integration
- Custom webhooks
- Event triggers

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  Hypernode Automation Engine (HAE)     │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────┐  ┌───────────────┐ │
│  │ Event Listener │  │ Job Matcher   │ │
│  │ (Solana)       │  │ Algorithm     │ │
│  └───────┬────────┘  └───────┬───────┘ │
│          │                   │         │
│          ▼                   ▼         │
│  ┌────────────────────────────────┐   │
│  │  Job Queue (Redis/Bull)        │   │
│  └───────────┬────────────────────┘   │
│              │                         │
│              ▼                         │
│  ┌────────────────┐  ┌──────────────┐ │
│  │ Agent          │  │ Metrics      │ │
│  │ Coordinator    │  │ Aggregator   │ │
│  └────────────────┘  └──────────────┘ │
│                                         │
└─────────────────────────────────────────┘
         │              │
         ▼              ▼
    Agents          Database
  (Eliza, etc)    (PostgreSQL)
```

---

## 📁 Project Structure

```
hypernode-automation-engine/
├── src/
│   ├── matchmaker/          # Job-node matching logic
│   ├── listeners/           # Solana event listeners
│   ├── agents/              # Agent integration
│   ├── metrics/             # Metrics aggregation
│   ├── webhooks/            # Webhook management
│   ├── queue/               # Job queue (Redis/Bull)
│   └── index.ts             # Main entry point
│
├── database/
│   ├── migrations/          # Database migrations
│   └── schema.sql           # Database schema
│
├── config/
│   └── default.json         # Configuration
│
├── tests/
│   ├── matchmaker.test.ts
│   └── ...
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Solana RPC access

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/hypernode-automation-engine.git
cd hypernode-automation-engine

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start development
npm run dev
```

---

## ⚙️ Configuration

```json
{
  "solana": {
    "rpcUrl": "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
    "programIds": {
      "nodeRegistry": "...",
      "jobReceipt": "...",
      "paymentSplitter": "..."
    }
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "database": "hypernode",
    "user": "hypernode",
    "password": "..."
  },
  "redis": {
    "host": "localhost",
    "port": 6379
  },
  "matchmaker": {
    "algorithm": "reputation_weighted",
    "minReputation": 50,
    "maxRetries": 3
  },
  "webhooks": {
    "discord": "https://discord.com/api/webhooks/...",
    "slack": "https://hooks.slack.com/services/..."
  }
}
```

---

## 🧠 Job Matching Algorithm

The matchmaker uses a sophisticated algorithm:

1. **Filter nodes** by requirements (GPU model, VRAM, capabilities)
2. **Score each node** based on:
   - Reputation score (0-1000)
   - Staked HYPER amount
   - Historical job completion rate
   - Current load
   - Response time
3. **Apply price** weighting
4. **Select top N nodes**
5. **Send job offer** to best node
6. **Fallback** if node rejects/offline

---

## 📊 Metrics Collected

- Total nodes registered
- Active nodes (online in last 5 minutes)
- Total jobs submitted
- Jobs completed / failed / cancelled
- Average job duration
- HYPER tokens paid
- GPU utilization across network
- Geographic distribution

---

## 🤖 Agent Integration

### Eliza Agent
```typescript
import { ElizaAgent } from './agents/eliza';

const agent = new ElizaAgent(config);
await agent.submitJob({
  type: 'llm_inference',
  model: 'qwen-7b',
  prompt: 'Explain quantum computing'
});
```

### Custom Agents
Agents can:
- Submit jobs via API
- Query node availability
- Monitor job progress
- React to completion events

---

## 🔔 Webhooks

Example Discord webhook on job completion:
```typescript
{
  "event": "job_completed",
  "job_id": "job_abc123",
  "node_id": "node_xyz789",
  "type": "llm_inference",
  "duration_ms": 5420,
  "cost_hyper": 2.5
}
```

---

## 🚢 Deployment

### Docker
```bash
docker build -t hypernode/automation-engine .
docker run -d \
  -p 3002:3002 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  hypernode/automation-engine
```

### Docker Compose
```bash
docker-compose up -d
```

---

## 📚 API Reference

### Internal APIs

#### POST /internal/matchmaker/match
Match a job to an available node

#### GET /internal/metrics/current
Get current network metrics

#### POST /internal/webhooks/trigger
Manually trigger a webhook

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- matchmaker.test.ts

# Integration tests
npm run test:integration
```

---

## 📝 License

MIT License

---

**Built with ❤️ for intelligent job orchestration**
