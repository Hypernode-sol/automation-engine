# Tokenomics & Incentive Model

## Token: x402

**Token Name:** x402  
**Purpose:** Incentivize node operators and agent developers within the Hypernode ecosystem.

## Participants & Rewards

| Participant         | Role                                   | Reward Mechanism                       |
|---------------------|----------------------------------------|----------------------------------------|
| Node Operator       | Hosts compute resources and runs agents | Earn x402 tokens per successfully executed task |
| Agent Developer     | Creates/publishes agents (Operators)   | Earn x402 per licensing / usage of their agent |
| External Client     | Consumes automation tasks from marketplace | Pays x402 to run agents or purchase services |

## Reward Structure

- Each agent has metadata field `token_reward` specifying x402 tokens awarded per execution.  
- Node operator receives a portion (e.g., 70%) of the reward; agent developer receives remainder (e.g., 30%).  
- Rewards are unlocked only after telemetry data confirms successful execution and verified duration.  
- Marketplace fees may apply (e.g., 5% fee on agent usage routed to Hypernode treasury).

## Token Flow Example

1. Client pays 500 x402 to execute Agent “benchmark-gpu-v1”.  
2. Operator node executes the task successfully.  
3. Telemetry confirms success; system issues 500 x402:  
   - Operator node wallet: +350 x402  
   - Agent developer wallet: +150 x402  
4. 25 x402 (5%) diverted to Hypernode treasury (optional).  
5. Transaction logged on-chain (or via ledger) and visible in dashboard.

## Governance & Sustainability

- Agents have rating system: high-quality agents may command higher rewards.  
- Node operators must maintain uptime & reliability; poor performance may lead to reduced reward multipliers.  
- Periodic token burn or staking mechanisms may be applied to manage supply and align incentives.

## Metrics & KPIs

- Total tasks executed per month  
- Average reward per node  
- Number of agents published and active  
- Node uptime / failure ratio  
- x402 tokens distributed vs. burned/staked  

---

