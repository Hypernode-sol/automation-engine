# Agent (Operator) Development Guide

## Overview

Agents (also referred to as Operators) are modular automation units that run on Hypernode nodes via the Hypernode Automation Engine.  
They follow the pattern: **Perceive → Reason → Act**.

## Project Structure

```text
sdk/
  template_agent/
    agent.py
    tests/
      test_agent.py
    README.md
