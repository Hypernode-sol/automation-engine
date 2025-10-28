# Hypernode API Specification

> Defines the base interfaces for node registration, agent publishing, task orchestration, telemetry submission, and reward emission within the Hypernode Automation Engine (HAE).

---

## 1. Base URL
```
https://api.hypernode.org/v1/
```

---

## 2. Authentication
All endpoints require Bearer authentication:

```
Authorization: Bearer <api_key>
```

Keys identify either **nodes** or **developers**, depending on context.

---

## 3. Economic Model Summary

- **Points** are verifiable computation credits validated through the **x402 protocol**.
- Points are **converted into $HYPER** during each reward epoch on Solana.
- The API does not mint or issue tokens directly — it only records proofs of valid computation.

---

## 4. Node Endpoints

### POST `/nodes/register`
Registers a node and provides runtime metadata.

**Request:**
```json
{
  "node_id": "node-001",
  "token_address": "hyper-addr-001",
  "capacity": {
    "cpu_cores": 8,
    "memory_gb": 32,
    "gpu_enabled": true
  },
  "network": {
    "bandwidth_mbps": 100,
    "location": "SP, BR"
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "registered_at": "2025-10-28T12:00:00Z",
  "heartbeat_interval": 60
}
```

---

### POST `/nodes/heartbeat`
Sends node liveness and minimal telemetry.

**Request:**
```json
{ "node_id": "node-001" }
```

**Response:**
```json
{ "status": "alive", "timestamp": "2025-10-28T12:01:00Z" }
```

---

### GET `/nodes/list`
Returns a paginated list of active nodes.

**Response:**
```json
{
  "nodes": [
    { "node_id": "node-001", "status": "active", "uptime": 98234 },
    { "node_id": "node-002", "status": "active", "uptime": 56212 }
  ]
}
```

---

## 5. Agent Endpoints

### POST `/agents/publish`
Publishes agent metadata to the Operator Registry (alpha).

**Request:**
```json
{
  "name": "benchmark-agent",
  "version": "0.1.0",
  "checksum": "sha256:acb13d...",
  "developer_address": "hyper-dev-addr",
  "royalty_bps": 250
}
```

**Response:**
```json
{
  "status": "published",
  "agent_id": "agent-benchmark-001",
  "timestamp": "2025-10-28T12:05:00Z"
}
```

---

### GET `/agents/list`
Retrieves all published agents and their metadata.

**Response:**
```json
{
  "agents": [
    { "name": "benchmark-agent", "version": "0.1.0", "developer": "hyper-dev-addr" },
    { "name": "image-analyzer", "version": "1.2.1", "developer": "hyper-lab" }
  ]
}
```

---

## 6. Task Endpoints

### POST `/tasks/create`
Creates a computational task for eligible nodes.

**Request:**
```json
{
  "agent": "benchmark-agent@0.1.0",
  "instruction": "benchmark gpu",
  "qos": { "priority": 3, "deadline": "2026-01-01T00:00:00Z" }
}
```

**Response:**
```json
{
  "status": "queued",
  "task_id": "task-0xabc",
  "assigned_node": "node-001"
}
```

---

### GET `/tasks/status/{id}`
Retrieves the current status and telemetry proof hash.

**Response:**
```json
{
  "task_id": "task-0xabc",
  "status": "completed",
  "telemetry_hash": "sha256:d9c23...",
  "points": 102.5,
  "verified": true
}
```

---

## 7. Reward Endpoints

### POST `/payments/emit`
Emits **points** to a node after verified execution. Conversion to **$HYPER** occurs at the next epoch.

**Request:**
```json
{
  "node_id": "node-001",
  "task_id": "task-0xabc",
  "telemetry_hash": "sha256:99ac...",
  "signature": "ecdsa:aa9f...",
  "points": 102.5
}
```

**Response:**
```json
{
  "status": "recorded",
  "epoch": "2025-10",
  "pending_conversion": true
}
```

---

### GET `/payments/summary?node_id={id}`
Retrieves the accumulated points and latest conversion state.

**Response:**
```json
{
  "node_id": "node-001",
  "total_points": 12034.7,
  "converted": 11900.0,
  "last_epoch": "2025-09",
  "current_status": "active"
}
```

---

## 8. Error Codes

| Code | Message | Meaning |
|------|----------|----------|
| 400 | Bad Request | Invalid payload or missing field |
| 401 | Unauthorized | Invalid or missing API key |
| 404 | Not Found | Resource unavailable |
| 409 | Conflict | Duplicate submission or invalid state |
| 500 | Internal Error | Unexpected system failure |

---

## 9. Technical Notes

- All timestamps are in **UTC (ISO 8601)**.  
- All bodies are **UTF-8 JSON**, canonicalized before hashing.  
- Hashes: **SHA-256**, Signatures: **ECDSA (secp256k1)**.  
- Network responses are compressed using **gzip** where supported.  
- The x402 protocol ensures reward proofs remain verifiable and tamper-resistant.

---

## 10. Status
Version: **v1.0.0-alpha**  
Maintained under: `/api/specification.md`  
Scope: **Public SDK integration and operator nodes**
