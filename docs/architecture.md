# Architecture Specification

## Layered Architecture Overview

The Hypernode Automation Engine (HAE) uses a three-layer model:

1. **Machine Layer**  
   - Hosts the compute nodes (Hypernode nodes) that provide CPU/GPU, memory and storage.  
   - Each node registers, reports capacity and receives tasks from orchestration engine.

2. **System Layer**  
   - Runtime environment for agent execution: containers or VMs.  
   - Agents can capture input (screenshots, hardware metrics), process, and act (APIs, UI interactions).  
   - Orchestrator schedules tasks, assigns nodes, collects telemetry.

3. **Intelligence Layer**  
   - Agent logic: perception, reasoning and action cycles.  
   - Uses Vision-Language-Action (VLA) models or custom logic.  
   - Supports both “no-code” (demonstration-based training) and “code” (SDK) workflows.

## Component Diagram

```text
+-----------------------------+
| Client / Marketplace        |
+-----------+-----------------+
            |
            v
+-----------+-----------------+
| Orchestrator Service         |
| - Task scheduler             |
| - Node registry              |
| - Telemetry collector        |
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
| Agent Logic (Intelligence)   |
| - Perceive()                 |
| - Reason()                   |
| - Act()                      |
+-----------------------------+
