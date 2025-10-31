#!/bin/bash

# Script to commit all 15 utility files individually
# Execute this from the parent directory containing all repositories

echo "Hypernode Repositories - Individual Commit Script"
echo "=================================================="
echo ""
echo "This script will create 15 individual commits across 3 repositories"
echo ""

# Network-and-Communication-Infrastructure (5 commits)
echo "Repository 1: Network-and-Communication-Infrastructure"
echo "------------------------------------------------------"

cd Network-and-Communication-Infrastructure || exit 1

echo "Commit 1/5: Health check script..."
git add scripts/health-check.sh
git commit -m "Add network health check utility script

Validates network connectivity and node communication.
Checks port availability, measures latency, and verifies DNS resolution."

echo "Commit 2/5: Node cleanup script..."
git add scripts/cleanup-nodes.sh
git commit -m "Add node cleanup utility for inactive nodes

Removes inactive nodes from registry based on timeout threshold.
Helps prevent memory leaks and maintains registry accuracy."

echo "Commit 3/5: Message monitoring script..."
git add scripts/monitor-messages.sh
git commit -m "Add message rate monitoring script

Tracks message throughput and identifies bottlenecks.
Provides real-time monitoring with peak and average rate calculations."

echo "Commit 4/5: Network configuration..."
git add config/network.properties
git commit -m "Add centralized network configuration file

Includes server settings, timeouts, thread pools, and performance tuning.
Provides single source of truth for network parameters."

echo "Commit 5/5: Node validator..."
git add scripts/validate-node.sh
git commit -m "Add node registration validator

Validates node ID format, IP address, and capacity before registration.
Prevents invalid data from entering the registry."

echo "✓ Network-and-Communication-Infrastructure: 5 commits created"
cd ..

echo ""
echo "Repository 2: Hypernode-LoadBalancer"
echo "------------------------------------"

cd Hypernode-LoadBalancer || exit 1

echo "Commit 6/10: Health monitor..."
git add scripts/health-monitor.sh
git commit -m "Add load balancer health monitoring script

Monitors active nodes, pending tasks, and resource usage.
Provides real-time alerts for high load and resource consumption."

echo "Commit 7/10: Strategy tester..."
git add scripts/test-strategies.sh
git commit -m "Add task allocation strategy performance tester

Compares round robin, capacity-based, and adaptive strategies.
Helps identify optimal allocation algorithm for workload."

echo "Commit 8/10: Load balancer configuration..."
git add config/loadbalancer.properties
git commit -m "Add load balancer configuration file

Defines allocation strategies, health check settings, and thresholds.
Centralizes all load balancer operational parameters."

echo "Commit 9/10: Capacity analyzer..."
git add scripts/analyze-capacity.sh
git commit -m "Add node capacity analysis utility

Analyzes capacity utilization across all nodes.
Provides recommendations for scaling decisions."

echo "Commit 10/10: Report generator..."
git add scripts/generate-report.sh
git commit -m "Add load distribution report generator

Creates detailed reports on task distribution and performance.
Useful for capacity planning and optimization analysis."

echo "✓ Hypernode-LoadBalancer: 5 commits created"
cd ..

echo ""
echo "Repository 3: Hypernode-Dashboard"
echo "---------------------------------"

cd Hypernode-Dashboard || exit 1

echo "Commit 11/15: API performance tester..."
git add scripts/test-api-performance.sh
git commit -m "Add dashboard API performance testing script

Tests API endpoint response times and success rates.
Provides performance ratings and identifies slow endpoints."

echo "Commit 12/15: Data validator..."
git add scripts/validate-data.sh
git commit -m "Add dashboard data validation utility

Validates data structures, error handling, and security measures.
Ensures dashboard code quality and XSS protection."

echo "Commit 13/15: Dashboard configuration..."
git add config/dashboard.properties
git commit -m "Add dashboard configuration file

Defines server settings, refresh intervals, and security options.
Centralizes all dashboard operational parameters."

echo "Commit 14/15: Theme switcher..."
git add scripts/switch-theme.sh
git commit -m "Add UI theme switching utility

Generates light and dark theme CSS configurations.
Enables dynamic theme switching for better user experience."

echo "Commit 15/15: Metrics collector..."
git add scripts/collect-metrics.sh
git commit -m "Add dashboard metrics collection script

Collects page views, API calls, and error rates.
Generates comprehensive usage reports for analysis."

echo "✓ Hypernode-Dashboard: 5 commits created"
cd ..

echo ""
echo "=========================================="
echo "✓ All 15 commits created successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review commits in each repository using 'git log'"
echo "2. Push to GitHub:"
echo ""
echo "   cd Network-and-Communication-Infrastructure"
echo "   git push origin main"
echo ""
echo "   cd ../Hypernode-LoadBalancer"
echo "   git push origin main"
echo ""
echo "   cd ../Hypernode-Dashboard"
echo "   git push origin main"
echo ""
