# tools/telemetry_inspector.py
# Simple local telemetry inspector to parse JSON lines and summarize metrics.

import argparse
import json
import os
from datetime import datetime

def read_lines(p):
    with open(p, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue

def main():
    parser = argparse.ArgumentParser(description="Hypernode Telemetry Inspector")
    parser.add_argument("--file", required=True, help="Path to telemetry JSONL file")
    args = parser.parse_args()

    if not os.path.exists(args.file):
        raise FileNotFoundError(args.file)

    total = 0
    ok = 0
    durations = []
    nodes = set()
    tasks = set()

    for row in read_lines(args.file):
        total += 1
        node = row.get("node_id")
        task = row.get("task_id")
        nodes.add(node)
        tasks.add(task)
        if row.get("success") is True:
            ok += 1
        if "metrics" in row and "exec_time" in row["metrics"]:
            durations.append(float(row["metrics"]["exec_time"]))

    avg = sum(durations) / len(durations) if durations else 0.0
    print("---- Telemetry Summary ----")
    print("Events:", total)
    print("Success:", ok)
    print("Nodes:", len(nodes))
    print("Tasks:", len(tasks))
    print("Avg exec time (s):", round(avg, 3))
    print("Generated at:", datetime.utcnow().isoformat(), "Z")

if __name__ == "__main__":
    main()
