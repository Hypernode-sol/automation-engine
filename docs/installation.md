# Installation Guide

## Prerequisites

Before you begin, ensure you have the following:
- A registered Hypernode in the network with credentials (`node_id`, `token_address`, etc.).
- Hardware specifications meeting minimum requirements:
  - CPU: 4+ cores  
  - RAM: 16 GB or more  
  - Storage: SSD with at least 100 GB free space  
  - Optional: GPU support (CUDA-capable) for accelerated agents  
- Network requirements:
  - Stable Internet connection (minimum 50 Mbps recommended)  
  - Open ports for runtime communication (e.g., 443, 8080)  
- Docker or equivalent container runtime installed (for isolation)  
- Python 3.10+ (or another supported runtime depending on your agent environment)

## Runtime Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hypernode/automation-engine.git
   cd automation-engine
