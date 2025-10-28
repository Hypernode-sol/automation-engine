// node_runtime/connector.js
// Hypernode Automation Engine - Node connector
// Loads node configuration (YAML), registers the node, and sends heartbeats.

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const axios = require("axios");

const ROOT = path.resolve(__dirname);
const CONFIG_PATH = path.join(ROOT, "config", "hypernode_node.yaml");

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Config not found: ${CONFIG_PATH}`);
  }
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return yaml.load(raw);
}

const cfg = loadConfig();
const API_URL = process.env.HYPERNODE_API || "https://api.hypernode.org/v1";
const API_KEY = process.env.HYPERNODE_API_KEY || "";

async function registerNode() {
  const payload = {
    node_id: cfg.node_id,
    token_address: cfg.token_address,
    capacity: cfg.capacity || {},
    network: cfg.network || {},
  };
  const headers = API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};
  const url = `${API_URL}/nodes/register`;
  const res = await axios.post(url, payload, { headers });
  console.log("[connector] Node registered:", res.data);
}

async function sendHeartbeat() {
  const payload = { node_id: cfg.node_id };
  const headers = API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};
  const url = `${API_URL}/nodes/heartbeat`;
  await axios.post(url, payload, { headers });
  console.log("[connector] Heartbeat sent");
}

function startHeartbeatLoop() {
  const intervalMs = 60_000;
  setInterval(async () => {
    try {
      await sendHeartbeat();
    } catch (err) {
      console.error("[connector] Heartbeat failed:", err?.message || err);
    }
  }, intervalMs);
}

(async () => {
  try {
    await registerNode();
    startHeartbeatLoop();
  } catch (err) {
    console.error("[connector] Registration failed:", err?.message || err);
    process.exit(1);
  }
})();

process.on("SIGINT", () => {
  console.log("[connector] SIGINT received, exiting.");
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("[connector] SIGTERM received, exiting.");
  process.exit(0);
});

