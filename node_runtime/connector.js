/**
 * Hypernode Automation Engine - Connector
 * Connects the local node runtime to the Hypernode Orchestrator API.
 */

import axios from "axios";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./config/node_config.json", "utf8"));
const API_URL = "https://api.hypernode.org/v1";

async function registerNode() {
  try {
    const res = await axios.post(`${API_URL}/nodes/register`, {
      node_id: config.node_id,
      token_address: config.token_address,
      capacity: config.capacity
    });
    console.log("✅ Node registered:", res.data);
  } catch (err) {
    console.error("❌ Node registration failed:", err.message);
  }
}

async function heartbeat() {
  setInterval(async () => {
    try {
      await axios.post(`${API_URL}/nodes/heartbeat`, { node_id: config.node_id });
      console.log("💓 Node heartbeat sent");
    } catch (err) {
      console.error("⚠️ Heartbeat failed:", err.message);
    }
  }, 60000);
}

registerNode();
heartbeat();
