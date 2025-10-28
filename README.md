# Hypernode Automation Engine (HAE)

> *“Automation, proof, and value — unified in a single computational fabric.”*

---

## ⚙️ Overview

The **Hypernode Automation Engine (HAE)** is the orchestration and execution layer of the **Hypernode Network**, a decentralized compute infrastructure that transforms computational work into **verifiable proofs** and **tokenized rewards**.

It connects **nodes**, **agents**, and **validators** through the **x402 protocol**, ensuring that every execution is deterministic, auditable, and economically incentivized.

---

## 🧩 Architecture Overview

```
┌────────────────────────────────────────────────────┐
│                    USER / CLIENT                   │
│────────────────────────────────────────────────────│
│     API Gateway / Orchestrator / Validator          │
└───────────────────────────┬─────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────┐
│                NODE RUNTIME LAYER (HAE)            │
│────────────────────────────────────────────────────│
│  • Node Connector (heartbeat, registration)        │
│  • Agent Sandbox Execution                         │
│  • Telemetry + Proof Generation (PoE)              │
│  • x402 Protocol Integration                       │
└───────────────────────────┬─────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────┐
│                   AGENT SDK LAYER                  │
│────────────────────────────────────────────────────│
│  • Agent API (Python / Rust)                       │
│  • Perception → Reasoning → Action cycle           │
│  • Deterministic task handling                     │
│  • Points emission                                 │
└────────────────────────────────────────────────────┘
```

---

## 🧰 Features

- **Proof-of-Execution (PoE):** cryptographic verification of every task.  
- **Node Runtime:** containerized agents running with full sandbox isolation.  
- **Points → $HYPER Conversion:** rewards governed by x402 epochs.  
- **Telemetry Engine:** transparent performance logging and auditing.  
- **Cross-language SDK:** agents in Python, Node, or Rust.  

---

## 📁 Repository Structure

```
automation-engine/
│
├── core/                     # Core orchestration logic
├── node_runtime/              # Node connector, sandbox, and telemetry
├── agent-sdk/                 # SDK for agent development
├── api/                       # REST & JSON-RPC specifications
├── docs/                      # Technical documentation
├── tests/                     # Unit and integration tests
└── .github/workflows/         # CI/CD pipelines
```

---

## 🧰 Requirements

- Docker ≥ 25.0  
- Node.js ≥ 18  
- Python ≥ 3.10  
- Rust ≥ 1.77  
- Solana CLI (for reward contract testing)  
- Linux (Ubuntu/Debian recommended)

---

## 🚀 Installation

```bash
git clone https://github.com/Hypernode-sol/automation-engine.git
cd automation-engine
bash node_runtime/installation_script.sh
```

This will:
- install dependencies  
- create `node_runtime/config/hypernode_node.yaml`  
- install npm and Python packages  
- prepare `.env` for Hypernode API  

---

## 🖥️ Running the Node Runtime

```
cd node_runtime
npm start
```

The runtime:
1. Registers the node.  
2. Sends heartbeats every 60 seconds.  
3. Executes agent workloads securely.  
4. Submits telemetry proofs to the orchestrator.

### Example Data Flow
```
┌────────────┐    Register   ┌──────────────┐
│ Node Agent │──────────────▶│ Orchestrator │
└────────────┘               └──────┬───────┘
        ▲                           │
        │     Proof of Execution    │
        └───────────────────────────┘
```

---

## 🧠 Agent Development (SDK)

Agents follow a three-step cognitive cycle: **Perceive → Reason → Act**

### Example Agent
```python
from agent import HypernodeAgent
from telemetry import get_metrics

class ExampleAgent(HypernodeAgent):
    def perceive(self):
        return get_metrics()
    def reason(self, data):
        return "run_task" if data["gpu"] < 70 else "idle"
    def act(self, action):
        if action == "run_task":
            self.execute_task("hypernode/benchmark:latest")

if __name__ == "__main__":
    ExampleAgent().run_cycle()
```

### Execution Cycle Diagram
```
┌────────────┐   metrics   ┌──────────────┐
│ Perceive() │────────────▶│ Reason()     │
└──────┬─────┘             └──────┬──────┘
       │ decision                │ action
       ▼                         ▼
   ┌───────────────┐     ┌─────────────────┐
   │  Act() Task   │────▶│ Telemetry Proof │
   └───────────────┘     └─────────────────┘
```

---

## 🔐 Security and Isolation

- Sandbox containers (Docker, seccomp, read-only FS)  
- Deterministic teardown post-execution  
- ECDSA + SHA-256 signatures on all proofs  
- Encrypted communication via TLS 1.3  
- Automated quarantine for inconsistent telemetry  

More: [Security and Isolation](https://github.com/Hypernode-sol/automation-engine/wiki/Security-and-Isolation)

---

## 📡 API Reference

Full API spec: [`api/specification.md`](api/specification.md)

| Category | Endpoint | Description |
|-----------|-----------|-------------|
| **Nodes** | `/nodes/register` | Register and configure nodes |
| **Heartbeat** | `/nodes/heartbeat` | Maintain uptime |
| **Agents** | `/agents/publish` | Publish agent metadata |
| **Tasks** | `/tasks/create` | Queue workloads |
| **Rewards** | `/payments/emit` | Submit proof and receive points |

Each proof is validated and recorded via the **x402 protocol**.

---

## 🧪 Continuous Integration

Pipeline (`.github/workflows/ci.yml`) automatically:
- Lints and tests Python and Node code  
- Validates directory and config structure  
- Ensures deterministic build outputs  

Run locally:
```bash
make test
```

---

## 💰 Economic Layer

- Nodes earn **points** through valid computations.  
- Points are periodically converted into **$HYPER** tokens.  
- The **x402 protocol** manages verification and conversion fairness.  
- Misbehavior reduces reputation and future rewards.

```
Computation → Proof → Points → $HYPER
```

Details: [Tokenomics and Rewards](https://github.com/Hypernode-sol/automation-engine/wiki/Tokenomics-and-Rewards)

---

## 🧭 Roadmap Summary

| Phase | Goal | Status |
|-------|------|--------|
| **0** | Node runtime, SDK, API layer | ✅ Done |
| **1** | Multi-node orchestration, telemetry dashboard | 🚧 In progress |
| **2** | Agent marketplace + economic rewards | 🔜 Planned |
| **3** | AI-assisted orchestration layer | 🔜 Planned |

See full details: [Roadmap and Future Work](https://github.com/Hypernode-sol/automation-engine/wiki/Roadmap-and-Future-Work)

---

## 🤝 Contributing

1. Fork the repository  
2. Create a branch  
3. Commit using **Conventional Commits**  
4. Open a pull request to `develop`  
5. CI validation must pass before merge  

Contributors earn **points → $HYPER** through accepted merges and verified contributions.

---

## 📜 License

Licensed under the **MIT License**.  
See [`LICENSE`](LICENSE).

---

> *“In Hypernode, computation is labor, proof is trust, and trust becomes value.”*

