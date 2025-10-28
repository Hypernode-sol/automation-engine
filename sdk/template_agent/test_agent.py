
import unittest
from agent import HypernodeAgent

class TestHypernodeAgent(unittest.TestCase):
    def test_agent_initialization(self):
        config = {"node_id": "test-node", "log_level": "DEBUG"}
        agent = HypernodeAgent(config)
        self.assertEqual(agent.config["node_id"], "test-node")

    def test_perceive_returns_dict(self):
        agent = HypernodeAgent({"log_level": "DEBUG"})
        state = agent.perceive()
        self.assertIsInstance(state, dict)
        self.assertIn("cpu_usage", state)
        self.assertIn("memory_usage", state)

    def test_reason_returns_action_plan(self):
        agent = HypernodeAgent({"log_level": "DEBUG"})
        state = {"cpu_usage": 5.0, "memory_usage": 30.0}
        instruction = "no action"
        plan = agent.reason(state, instruction)
        self.assertIsInstance(plan, dict)
        self.assertIn("action", plan)

    def test_act_returns_boolean(self):
        agent = HypernodeAgent({"log_level": "DEBUG"})
        plan = {"action": "noop", "parameters": {}}
        result = agent.act(plan)
        self.assertIsInstance(result, bool)

if __name__ == "__main__":
    unittest.main()
