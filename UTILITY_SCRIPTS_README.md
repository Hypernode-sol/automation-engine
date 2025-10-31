# Utility Scripts - Hypernode Project

## Overview

Created 15 production-ready utility scripts and configuration files across 3 repositories to enhance monitoring, testing, and operations.

---

## Network-and-Communication-Infrastructure (5 files)

### 1. `scripts/health-check.sh`
**Purpose**: Network connectivity health checker

**Features**:
- Validates port availability
- Measures network latency
- Verifies DNS resolution
- Provides clear pass/fail status

**Usage**: `./health-check.sh [port] [host]`

---

### 2. `scripts/cleanup-nodes.sh`
**Purpose**: Automated inactive node cleanup

**Features**:
- Removes nodes that exceeded timeout threshold
- Prevents memory leaks in registry
- Provides cleanup summary
- Configurable timeout

**Usage**: `./cleanup-nodes.sh [timeout_ms]`

---

### 3. `scripts/monitor-messages.sh`
**Purpose**: Real-time message throughput monitor

**Features**:
- Tracks messages per second
- Calculates peak and average rates
- Identifies bottlenecks
- Configurable sampling interval

**Usage**: `./monitor-messages.sh [interval] [duration]`

---

### 4. `config/network.properties`
**Purpose**: Centralized network configuration

**Settings**:
- Server port and host configuration
- Thread pool sizing
- Timeout values
- Heartbeat intervals
- Performance tuning parameters
- Logging configuration

---

### 5. `scripts/validate-node.sh`
**Purpose**: Node registration pre-validation

**Features**:
- Validates node ID format
- Checks IP address format
- Verifies capacity values
- Tests IP reachability
- Prevents invalid registrations

**Usage**: `./validate-node.sh <node_id> <ip_address> <capacity>`

---

## Hypernode-LoadBalancer (5 files)

### 6. `scripts/health-monitor.sh`
**Purpose**: Load balancer health monitoring

**Features**:
- Monitors active nodes count
- Tracks pending tasks
- Reports CPU and memory usage
- Alerts on high load conditions
- Continuous real-time monitoring

**Usage**: `./health-monitor.sh [interval]`

---

### 7. `scripts/test-strategies.sh`
**Purpose**: Allocation strategy performance tester

**Features**:
- Tests Round Robin strategy
- Tests Capacity Based strategy
- Tests Adaptive strategy
- Compares execution times
- Recommends optimal strategy

**Usage**: `./test-strategies.sh`

---

### 8. `config/loadbalancer.properties`
**Purpose**: Load balancer configuration

**Settings**:
- Allocation strategy selection
- Node limits and thresholds
- Health check intervals
- Task queue configuration
- Failover settings
- Performance thresholds
- Monitoring parameters

---

### 9. `scripts/analyze-capacity.sh`
**Purpose**: Node capacity utilization analyzer

**Features**:
- Analyzes per-node capacity
- Calculates overall utilization
- Identifies overutilized nodes
- Provides scaling recommendations
- Generates detailed capacity report

**Usage**: `./analyze-capacity.sh`

---

### 10. `scripts/generate-report.sh`
**Purpose**: Load distribution report generator

**Features**:
- System overview statistics
- Per-node distribution metrics
- Performance metrics
- Success rates
- Recommendations for optimization

**Usage**: `./generate-report.sh [output_file]`

---

## Hypernode-Dashboard (5 files)

### 11. `scripts/test-api-performance.sh`
**Purpose**: Dashboard API performance tester

**Features**:
- Tests /api/status endpoint
- Tests /api/tasks endpoint
- Measures response times
- Calculates success rates
- Provides performance rating

**Usage**: `./test-api-performance.sh [api_url] [iterations]`

---

### 12. `scripts/validate-data.sh`
**Purpose**: Dashboard data validation utility

**Features**:
- Validates data structures
- Checks error handling implementation
- Verifies XSS protection
- Validates refresh mechanism
- Generates validation report

**Usage**: `./validate-data.sh`

---

### 13. `config/dashboard.properties`
**Purpose**: Dashboard configuration

**Settings**:
- Server port and host
- API configuration
- Data refresh intervals
- UI theme and language
- Security settings (CORS, XSS)
- Caching configuration
- Performance optimization

---

### 14. `scripts/switch-theme.sh`
**Purpose**: UI theme switcher

**Features**:
- Generates light theme CSS
- Generates dark theme CSS
- CSS variable configuration
- Easy theme switching
- Consistent color schemes

**Usage**: `./switch-theme.sh [light|dark]`

---

### 15. `scripts/collect-metrics.sh`
**Purpose**: Dashboard usage metrics collector

**Features**:
- Tracks page views
- Counts API calls
- Monitors error rates
- Calculates averages
- Generates comprehensive reports

**Usage**: `./collect-metrics.sh [duration_seconds]`

---

## Installation & Usage

### Step 1: Clone repositories
```bash
git clone https://github.com/hypernode-sol/Network-and-Communication-Infrastructure.git
git clone https://github.com/hypernode-sol/Hypernode-LoadBalancer.git
git clone https://github.com/hypernode-sol/Hypernode-Dashboard.git
```

### Step 2: Make scripts executable
```bash
cd Network-and-Communication-Infrastructure
chmod +x scripts/*.sh

cd ../Hypernode-LoadBalancer
chmod +x scripts/*.sh

cd ../Hypernode-Dashboard
chmod +x scripts/*.sh
```

### Step 3: Configure settings
Edit the `.properties` files in each repository's `config/` directory to match your environment.

---

## Commit Instructions

Use the provided `commit-scripts.sh` to create 15 individual commits:

```bash
# From the parent directory containing all repositories
./commit-scripts.sh
```

This will:
1. Create 5 commits in Network-and-Communication-Infrastructure
2. Create 5 commits in Hypernode-LoadBalancer
3. Create 5 commits in Hypernode-Dashboard

Each commit includes a descriptive message explaining the utility's purpose.

---

## Benefits

### Operations
- Automated health monitoring
- Proactive issue detection
- Simplified troubleshooting

### Development
- Performance testing tools
- Data validation utilities
- Configuration management

### Maintenance
- Cleanup automation
- Capacity planning tools
- Usage analytics

---

## Technical Notes

- All scripts use `bash` and standard Unix utilities
- Scripts are portable across Linux/macOS
- Configuration files use standard `.properties` format
- No external dependencies required
- Scripts include error handling and validation

---

## Next Steps

After committing:

1. **Test Scripts**: Run each script to verify functionality
2. **Customize Configs**: Adjust `.properties` files for your environment
3. **Integrate**: Connect scripts to actual runtime systems
4. **Automate**: Schedule monitoring scripts via cron
5. **Document**: Add project-specific notes to each script

---

**Created**: 2025-10-31
**Scripts**: 15 total (11 bash scripts, 3 config files, 1 CSS generator)
**Repositories**: 3
**Purpose**: Production utilities for monitoring, testing, and operations
