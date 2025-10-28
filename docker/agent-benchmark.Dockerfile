# docker/agent-benchmark.Dockerfile
FROM python:3.11-slim

WORKDIR /opt/agent
COPY sdk/template_agent /opt/agent

RUN pip install --no-cache-dir -r /opt/agent/requirements.txt

# Default instruction can be overridden via env var
ENV AGENT_INSTRUCTION="benchmark gpu"
CMD ["python", "agent.py", "--instruction", "${AGENT_INSTRUCTION}"]
