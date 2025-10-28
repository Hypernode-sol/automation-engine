# Hypernode Automation Engine (HAE)

Distributed automation runtime and SDK powering intelligent agent execution across the Hypernode network.

[![CI](https://img.shields.io/github/actions/workflow/status/Hypernode-sol/automation-engine/ci.yml?branch=main)](https://github.com/Hypernode-sol/automation-engine/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Developing Agents](#developing-agents)
- [APIs (Excerpt)](#apis-excerpt)
- [Tokenomics (Summary)](#tokenomics-summary)
- [Security & Isolation](#security--isolation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**Hypernode Automation Engine (HAE)** turns any Hypernode into a host for intelligent **Operators (agents)** that can **perceive → reason → act**.  
Nodes execute automation tasks, developers publish agents, and clients consume automation on demand — all integrated with the **x402** token incentive layer.

Core goals:
- Make distributed automation trivial to deploy across heterogeneous nodes.
- Provide a clean SDK for building **Vision–Language–Action (VLA)** agents.
- Ensure secure, auditable execution with rewards for successful tasks.

---

## Key Features

- **Node registration & capacity reporting** for distributed scheduling.
- **Agent runtime** with a simple **perceive → reason → act** loop.
- **SDK + template** for rapid agent development.
- **Telemetry & logging** for observability.
- **x402 incentive model** (operators and developers get paid per execution).
- **CI workflow** out-of-the-box with GitHub Actions.

---

## Architecture

HAE follows a three-layer model:

1. **Machine Layer** — physical/virtual nodes (CPU/GPU, RAM, storage).  
2. **System Layer** — runtime & orchestration (containers/VMs, I/O abstraction, telemetry).  
3. **Intelligence Layer** — agent logic with VLA models or custom rules.

**High-level diagram:**

```
+-----------------------------+
| Client / Marketplace        |
+-----------+-----------------+
            |
            v
+-----------+-----------------+
| Orchestrator Service        |
| - Task scheduler            |
| - Node registry             |
| - Telemetry collector       |
+-----------+-----------------+
            |
            v
+-----------+-----------------+
| Node Runtime (Machine/System)|
| - Agent container            |
| - SDK                        |
| - Logs & status              |
+-----------+-----------------+
            |
            v
+-----------+-----------------+
| Agent Logic (Intelligence)  |
| - Perceive()                |
| - Reason()                  |
| - Act()                     |
+-----------------------------+
```

For detailed docs, see **/docs/architecture.md**.

---

## Repository Structure

```
automation-engine/
├─ README.md
├─ LICENSE
├─ CONTRIBUTING.md
├─ docs/
│  ├─ installation.md
│  ├─ agent_development.md
│  ├─ tokenomics.md
│  └─ architecture.md
├─ api/
│  └─ specification.md
├─ sdk/
│  └─ template_agent/
│     ├─ agent.py
│     ├─ requirements.txt
│     ├─ README.md
│     └─ tests/
│        └─ test_agent.py
├─ node_runtime/
│  ├─ installation_script.sh
│  ├─ connector.js
│  └─ config/
│     └─ hypernode_node.yaml
└─ .github/
   └─ workflows/
      └─ ci.yml
```

---

## Installation

> For full instructions, read **/docs/installation.md**.

**Prerequisites**
- Linux host (Ubuntu 22.04+ recommended), Docker, Python 3.10+
- Optional GPU with CUDA for accelerated agents
- Stable Internet connection

**Steps (summary)**

```bash
git clone https://github.com/Hypernode-sol/automation-engine.git
cd automation-engine/node_runtime

chmod +x installation_script.sh
./installation_script.sh

# Edit node configuration (example)
sed -i 's/example-node/my-node-001/' config/hypernode_node.yaml
```

Start the connector (example):

```bash
# NodeJS 18+ recommended
node connector.js
```

Verify node status (example endpoint):

```bash
curl "https://api.hypernode.org/nodes/status?node_id=my-node-001"
```

---

## Quick Start

Run the template agent:

```bash
cd sdk/template_agent
pip install -r requirements.txt
python agent.py --instruction "perform benchmark on idle GPU"
```

Run tests:

```bash
pytest
```

---

## Developing Agents

> See **/docs/agent_development.md** for a complete guide.

**Pattern**: implement three methods in `agent.py`:
- `perceive()` — gather environment state (metrics, screenshots, etc.).
- `reason(state, instruction)` — decide an action plan.
- `act(action_plan)` — execute the selected action.

Minimal snippet:

```python
from agent import HypernodeAgent
agent = HypernodeAgent({"node_id": "dev-node"})
agent.run("run health check")
```

Publish flow (suggested):
1. Fork the repo and create your agent under `sdk/your_agent/`.
2. Add tests and update `requirements.txt`.
3. Open a PR to `dev` branch for review.
4. Upon approval, the agent becomes available to the internal marketplace.

---

## APIs (Excerpt)

> Full contract: **/api/specification.md**

- `POST /nodes/register` — register node with capacity metadata.  
- `GET /nodes/list` — list active nodes.  
- `POST /agents/publish` — publish a new agent.  
- `GET /agents/list` — list available agents.  
- `POST /tasks/create` — request task execution.  
- `GET /tasks/status/{id}` — query task status.  
- `POST /payments/emit` — emit token rewards after completion.

All requests require:
```
Authorization: Bearer <api_key>
```

---

## Tokenomics (Summary)

- **x402** is the incentive token for the automation network.  
- **Node operators** earn per successful task; **agent developers** earn from usage/licensing.  
- Example split (configurable): 70% operator / 30% developer (+ optional protocol fee).  
- Telemetry-confirmed success triggers payouts.

Details: **/docs/tokenomics.md**.

---

## Security & Isolation

- Agents run in isolated containers/VMs (least-privilege).  
- Telemetry and logs are collected for auditing.  
- Authentication via API keys (`Bearer`).  
- Resource quotas and safeguards to prevent abuse.

---

## Roadmap

- **Phase 0** — Base repo, template agent, APIs, docs ✓  
- **Phase 1** — Node registration, simple execution, basic dashboard  
- **Phase 2** — Marketplace publishing, payouts, ratings  
- **Phase 3** — GPU acceleration, scaling, multi-region orchestration

> Issues and feature requests are tracked in GitHub Issues.

---

## Contributing

We welcome contributions!  
See **/CONTRIBUTING.md** and open PRs against the `dev` branch.  
CI via GitHub Actions (`.github/workflows/ci.yml`).

---

## License

MIT — see **/LICENSE**.

---

## Contact

- Email: contact@hypernodesolana.org  
- Twitter: https://x.com/hypernode_sol

© 2025 Hypernode Solana — All rights reserved.
