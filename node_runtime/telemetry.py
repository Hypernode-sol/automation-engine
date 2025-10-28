# node_runtime/telemetry.py
# Minimal local metrics collection for nodes/agents.

import time
import json

try:
    import psutil
except ImportError:
    psutil = None

def get_node_metrics():
    if psutil is None:
        return {
            "cpu_usage": None,
            "memory_used_mb": None,
            "timestamp": time.time()
        }
    cpu = psutil.cpu_percent(interval=0.2)
    mem = psutil.virtual_memory().used / (1024 * 1024)
    return {
        "cpu_usage": cpu,
        "memory_used_mb": round(mem, 2),
        "timestamp": time.time()
    }

if __name__ == "__main__":
    print(json.dumps(get_node_metrics()))
