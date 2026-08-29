# Person 6: DevOps, Sandbox & Security — Repository Analysis

**Date:** 2026-08-29  
**Branch:** person6/security-sandbox  
**Status:** Repository inspected, NO FILES MODIFIED

---

## 1. CURRENT SERVICES

### Existing Services in docker-compose.yml:
1. **frontend** — React UI (Vite-based), port 3000
2. **backend** — FastAPI service, port 8000
3. **ollama** — Local LLM inference server, port 11434 (GPU-enabled)
4. **sandbox** — Isolated code execution container (minimal Python image)

### Network Configuration:
- All services connected to `secure-internal` Docker network
- Network marked `internal: true` — **air-gapped from external internet**
- No exposed external ports for internal services

---

## 2. DOCKER-COMPOSE.YML CURRENT STATE

**File Location:** `docker-compose.yml`

**Services:**
```
- frontend: Build from ./frontend, port 3000
- backend: Build from ./backend, port 8000, depends_on: ollama
- ollama: ollama/ollama:latest, port 11434, GPU support (NVIDIA), volume: ollama_data
- sandbox: Build from ./sandbox, connected to secure-internal network
```

**Volumes:**
- `ollama_data` — persistent storage for Ollama models

**Networks:**
- `secure-internal` with `internal: true` (completely air-gapped)

**Gaps/Issues:**
- ❌ Frontend/Backend Dockerfiles NOT YET CREATED
- ❌ No explicit volume mounts for code/data sharing
- ❌ No health checks defined
- ❌ No restart policies defined
- ❌ No resource limits defined
- ❌ No logging configuration
- ⚠️ Ollama exposed to port 11434 (internal to secure-internal network, but consider further restriction)

---

## 3. SANDBOX/ DIRECTORY CONTENTS

**File Location:** `sandbox/Dockerfile`

**Current Implementation:**
```dockerfile
FROM python:3.10-slim

# Non-root user execution
RUN useradd -m sandboxuser
USER sandboxuser
WORKDIR /home/sandboxuser

# Base packages only
RUN pip install pandas numpy matplotlib openpyxl --no-cache-dir

CMD ["python", "execute_code.py"]
```

**Current State:**
- ✅ Non-root user (`sandboxuser`) enforced
- ✅ Lightweight image (`python:3.10-slim`)
- ✅ Only essential data science libraries
- ❌ NO actual execution mechanism implemented
- ❌ NO `execute_code.py` file exists
- ❌ NO volume mounts configured
- ❌ NO network isolation beyond `secure-internal`
- ❌ NO resource limits
- ❌ NO security policies (read-only filesystems, capabilities dropping)

---

## 4. HOW AGENT CURRENTLY EXECUTES CODE

**Current State: NOT IMPLEMENTED**

### Code Execution Path (Planned):
1. **User Input** → Frontend Chat UI
2. **API Request** → `POST /api/chat` (backend/api/routes.py)
3. **Task Classification** → `classifier.py` determines task type (coding/document/vision)
4. **Agent Planning** → `planner.py` creates execution plan
5. **Tool Invocation** → `tools.py` has stub for `run_code_in_sandbox(code: str)`
6. **Sandbox Execution** → Should call sandbox container via Docker API/HTTP
7. **Result Return** → Output back to frontend

**Current Implementation Status:**
- ✅ Task classifier implemented (`classifier.py`)
- ✅ Router implemented (`router.py`) — directs to correct model
- ✅ Agent planner scaffolded (`planner.py`)
- ✅ Tools scaffolded (`tools.py`)
- ❌ `run_code_in_sandbox()` — STUB ONLY (no actual implementation)
- ❌ No Docker SDK integration
- ❌ No execution timeout handling
- ❌ No output capture mechanism
- ❌ No error handling or sanitization

---

## 5. IS ANY CODE CURRENTLY EXECUTED DIRECTLY ON HOST?

**Answer: YES — HIGH SECURITY RISK**

### Current Execution Points:
1. **Backend FastAPI Server** — runs on host or in Docker
2. **Ollama Server** — runs in Docker (safe)
3. **Frontend Dev Server** — runs on host (dev mode)
4. **Agent Tools** — if `run_code_in_sandbox()` is called but unimplemented, code could fall back to host execution

### Risk Assessment:
- ⚠️ No explicit host code execution currently, but path is NOT BLOCKED
- ⚠️ `tools.py:run_code_in_sandbox()` is a stub — if called, would return dummy response
- ⚠️ No input sanitization for code that flows to agent
- ⚠️ File operations in `tools.py:read_file()` read from host filesystem directly

---

## 6. DOCKER NETWORKS CURRENTLY EXIST

**Network: `secure-internal`**
- Type: bridge network
- Internal: `true` (no external outbound access)
- Services: frontend, backend, ollama, sandbox
- No explicit network policies beyond "internal"

**Missing Hardening:**
- ❌ No per-service network isolation (all services can reach each other)
- ❌ No explicit deny rules
- ❌ No network policies/security groups
- ❌ Sandbox not restricted from reaching backend on port 8000
- ❌ Sandbox not restricted from reaching ollama on port 11434

---

## 7. PORTS EXPOSED

| Service | Internal Port | Host Port | Network | Status |
|---------|--------------|-----------|---------|--------|
| frontend | 3000 | 3000 | secure-internal | ✅ Exposed to host (UI) |
| backend | 8000 | 8000 | secure-internal | ✅ Exposed to host (API) |
| ollama | 11434 | 11434 | secure-internal | ⚠️ Exposed to host (should be internal only) |
| sandbox | - | - | secure-internal | ✅ No port exposed (correct) |

**Security Issues:**
- ⚠️ Ollama port exposed to host (consider removing external exposure)
- ⚠️ No port restrictions between internal services

---

## 8. HOST DIRECTORIES MOUNTED

**Current Mounts:**
1. **Ollama Data** — `ollama_data:/root/.ollama` (volume, not bind mount)

**Missing Mounts:**
- ❌ No code input directory for sandbox
- ❌ No code output directory for sandbox
- ❌ No temp directory for generated files
- ❌ No logging directory
- ❌ Backend working directory not mounted
- ❌ Frontend source not mounted (no hot-reload in prod)

---

## 9. SECURITY RISKS CURRENTLY EXIST

### CRITICAL RISKS:
1. **No Sandbox Execution Mechanism**
   - Code execution path is completely unimplemented
   - Fallback behavior undefined (could execute on host)
   - No process isolation, timeout, or resource limits

2. **Direct Filesystem Access**
   - `tools.py:read_file()` reads arbitrary files without restrictions
   - No path whitelist or sandboxing
   - Agent could read sensitive host files

3. **No Input Validation**
   - Code received from LLM is not sanitized
   - No AST analysis or dangerous function detection
   - No restrictions on imports or system calls

4. **Cross-Container Network Access**
   - Sandbox can reach backend and ollama
   - No network policies enforced
   - No reverse firewall rules

5. **CORS Misconfiguration**
   - `backend/main.py` has `allow_origins=["*"]` 
   - Comment says "In production, restrict to localhost / specific IP"
   - Currently allows any origin to access backend API

### HIGH RISKS:
6. **No Resource Limits**
   - Containers have unlimited CPU, memory, disk I/O
   - Sandbox could perform DoS attacks on host or other containers
   - No timeout enforcement on code execution

7. **No Logging/Monitoring**
   - No centralized logging configured
   - No audit trail for code execution
   - No alerting on security events

8. **No Secret Management**
   - No `.env` files with configs
   - Hardcoded localhost:11434 URLs
   - No API key management

9. **Incomplete Security Hardening**
   - Sandbox has non-root user (good) but no other protections
   - No read-only filesystem
   - No capability dropping
   - No seccomp profiles
   - No AppArmor/SELinux policies

### MEDIUM RISKS:
10. **No Health Checks**
    - Containers could fail silently
    - No automatic restart or recovery
    - No circuit breaker for backend → ollama

11. **No Restart Policies**
    - If services crash, they stay down
    - Manual intervention required

12. **GPU Sharing**
    - Ollama requires GPU; no access control if multiple users
    - Potential for GPU exhaustion attacks

---

## 10. FILES PERSON 6 SHOULD MODIFY

### PRIMARY FILES (Person 6 Responsibility):

1. **`docker-compose.yml`** — ADD/MODIFY:
   - Frontend Dockerfile definition
   - Backend Dockerfile definition
   - Volume mounts for sandbox code input/output
   - Health checks for all services
   - Resource limits (CPU, memory)
   - Restart policies
   - Logging configuration
   - Network policies / service isolation
   - Remove external Ollama port exposure

2. **`frontend/Dockerfile`** — CREATE:
   - Build React app with Vite
   - Serve with lightweight HTTP server (nginx or Node)
   - No source code in final image
   - Health check

3. **`backend/Dockerfile`** — CREATE:
   - Base Python 3.11+ image
   - Install dependencies from requirements.txt
   - Non-root user execution
   - Health check endpoint

4. **`sandbox/Dockerfile`** — MODIFY:
   - Add resource limits via docker-compose
   - Add security policies (read-only root, capability dropping)
   - Create `execute_code.py` entry point
   - Add timeout mechanism
   - Add output capture mechanism
   - Add security sandbox library (e.g., RestrictedPython)

5. **`sandbox/execute_code.py`** — CREATE:
   - Implement secure code execution
   - Capture stdout/stderr
   - Enforce timeout
   - Return structured output (exit code, stdout, stderr)
   - Handle exceptions gracefully

6. **`sandbox/security_policies.py`** — CREATE:
   - Implement code validation
   - Block dangerous imports (os, subprocess, sys, etc.)
   - Block dangerous functions (eval, exec, __import__)
   - Whitelist allowed modules
   - AST-based analysis

7. **`.env.example`** — CREATE:
   - Template for environment variables
   - Ollama URL, backend host/port, logging level, etc.

8. **`docker-compose.override.yml`** — CREATE (optional):
   - Development overrides (port mappings, volumes for hot-reload)
   - Not committed to repo

9. **`scripts/build.sh`** — CREATE:
   - Script to build all containers
   - Pre-flight security checks

10. **`scripts/run.sh`** — CREATE:
    - Script to start the workbench with docker-compose
    - Validation checks

11. **`monitoring/prometheus.yml`** — CREATE:
    - Prometheus config for metrics collection
    - Monitor container resource usage

12. **`monitoring/docker-compose.monitoring.yml`** — CREATE (optional):
    - Add Prometheus, Grafana, ELK stack
    - For logging and monitoring infrastructure

13. **`.dockerignore`** files — CREATE for frontend and backend:
    - Exclude node_modules, __pycache__, etc.

14. **`DEPLOYMENT.md`** — CREATE:
    - Deployment and security documentation
    - Network architecture diagrams
    - Security policies and assumptions

---

## 11. FILES BELONGING TO OTHER TEAM MEMBERS

### DO NOT MODIFY:

**Person 1: (Not identified from code comments)**
- (No specific files tagged)

**Person 2: Backend API & Integration Engineer**
- ✅ `backend/main.py` — except CORS configuration (security hardening needed)
- ✅ `backend/api/routes.py` — endpoint definitions
- ⚠️ CORS config in main.py should be reviewed with Person 6

**Person 3: AI Models & Model Router Engineer**
- ✅ `backend/llm/classifier.py`
- ✅ `backend/llm/router.py`
- ✅ `backend/llm/ollama_client.py`
- ✅ `backend/llm/models_config.py`
- ✅ `backend/llm/dev_server.py`
- ✅ `backend/llm/api.py`
- ✅ `backend/llm/test_*.py`

**Person 4: Agent & Tools Engineer**
- ✅ `backend/agent/planner.py` — core agent logic
- ⚠️ `backend/agent/tools.py` — Person 6 should implement `run_code_in_sandbox()` function signature, but Person 4 owns business logic

**Person 5: RAG, OCR & Vision Specialist**
- ✅ `backend/rag/vector_store.py`
- ✅ `backend/vision/ocr.py`

**Frontend Developer (Person ?)**
- ✅ `frontend/src/` — all React components
- ✅ `frontend/package.json` — except adding Docker-specific deps (dev only)
- ✅ `frontend/vite.config.js`
- ✅ `frontend/tailwind.config.js`

### SHARED RESPONSIBILITY:

**`backend/requirements.txt`**
- Primary owner: Person 2 (backend API)
- Person 6 involvement: Review for security, add Docker-specific packages if needed
- Other persons: Add dependencies as needed, coordinate with Person 2

**`backend/main.py` — CORS Configuration**
- Current: `allow_origins=["*"]`
- Person 6 should harden: restrict to `["http://localhost:3000", "http://127.0.0.1:3000"]`
- Coordinate with Person 2 for deployment CORS needs

---

## 12. PHASED IMPLEMENTATION PLAN FOR PERSON 6

### PHASE 1: Foundation & Dockerization (Week 1)
**Objective:** Build Docker images for all services

**Tasks:**
1. Create `frontend/Dockerfile`
   - Multi-stage build (build stage + runtime stage)
   - Build React app with Vite
   - Serve via nginx or Node
   - Health check endpoint
   
2. Create `backend/Dockerfile`
   - Python 3.11+ base image
   - Non-root user
   - Install from requirements.txt
   - Expose port 8000
   - Health check endpoint
   
3. Update `docker-compose.yml`
   - Add frontend and backend Dockerfile definitions
   - Remove ollama port 11434 external exposure
   - Add health checks for all services
   - Add restart policies
   - Add resource limits (CPU, memory)

4. Create `.dockerignore` files
   - frontend/.dockerignore
   - backend/.dockerignore
   - sandbox/.dockerignore

5. Test local build
   - `docker-compose build`
   - Verify all images build successfully

---

### PHASE 2: Sandbox Security Hardening (Week 1-2)
**Objective:** Implement secure code execution sandbox

**Tasks:**
1. Create `sandbox/execute_code.py`
   - Read code from stdin or mounted volume
   - Execute with timeout (default 30s)
   - Capture stdout/stderr
   - Return JSON response: `{exit_code, stdout, stderr, duration_ms}`
   - Handle exceptions gracefully
   
2. Create `sandbox/security_policies.py`
   - Implement RestrictedPython integration
   - Block dangerous imports: os, subprocess, sys, socket, etc.
   - Block dangerous functions: eval, exec, __import__, open (with restrictions)
   - Whitelist safe modules: pandas, numpy, matplotlib, json, etc.
   - AST-based validation of code before execution
   
3. Update `sandbox/Dockerfile`
   - Add `RestrictedPython` library
   - Add `timeout-decorator` or signal-based timeout
   - Add `psutil` for resource monitoring
   - Non-root user (already done, verify)
   - Read-only root filesystem (optional but recommended)
   
4. Implement Backend ↔ Sandbox Communication
   - Update `backend/agent/tools.py:run_code_in_sandbox()`
   - Use Docker SDK or HTTP API to execute code in sandbox
   - Pass code via stdin or volume mount
   - Capture and return output
   - Error handling for timeout, OOM, crashes

---

### PHASE 3: Network Isolation & Security (Week 2)
**Objective:** Enforce network policies and access controls

**Tasks:**
1. Configure Network Policies
   - Update `docker-compose.yml`
   - Ensure sandbox cannot reach backend or ollama (or restrict to read-only)
   - Frontend can reach backend only
   - Backend can reach ollama only
   - All services isolated from external networks

2. Implement API Security in Backend
   - Harden CORS: restrict to `localhost:3000`
   - Add input validation middleware
   - Add rate limiting
   - Add request logging

3. Sandbox Process Isolation
   - Drop unnecessary Linux capabilities (CAP_NET_ADMIN, CAP_SYS_ADMIN, etc.)
   - Implement seccomp profile to block dangerous syscalls
   - Read-only filesystem for /usr, /etc (optional)
   - Tmpfs for /tmp with size limits

4. Update `docker-compose.yml`
   - Add `cap_drop` for sandbox
   - Add `read_only: true` where applicable
   - Add tmpfs mounts for temporary directories
   - Add `security_opt: ["seccomp=..."]` (optional)

---

### PHASE 4: Logging, Monitoring & Observability (Week 2-3)
**Objective:** Implement comprehensive logging and monitoring

**Tasks:**
1. Configure Container Logging
   - Update `docker-compose.yml` with logging drivers
   - JSON file logging with rotation
   - Structured logging format

2. Create `monitoring/prometheus.yml`
   - Configure Prometheus to scrape container metrics
   - Monitor CPU, memory, disk I/O
   - Monitor network traffic between containers

3. Create `monitoring/docker-compose.monitoring.yml` (optional)
   - Add Prometheus service
   - Add Grafana for dashboards
   - Add Loki for centralized logging (optional)
   - Add AlertManager for alerts (optional)

4. Implement Application Logging
   - Backend: structured logging with timestamps, log levels
   - Sandbox: execution logs (code, output, errors, duration)
   - Frontend: error/warning logging to backend

5. Health Checks
   - Backend `/health` endpoint
   - Frontend health check (HTTP 200 on root or /health)
   - Ollama health check (via API)
   - Sandbox health check (keep-alive)

---

### PHASE 5: Deployment & Offline Operation (Week 3-4)
**Objective:** Prepare for offline deployment

**Tasks:**
1. Create `.env.example`
   - OLLAMA_URL, BACKEND_HOST, BACKEND_PORT, LOG_LEVEL, etc.
   - Document all environment variables

2. Create `scripts/build.sh`
   - Build all Docker images
   - Pre-flight security checks
   - Verify no external dependencies

3. Create `scripts/run.sh`
   - Start docker-compose
   - Validate services are healthy
   - Output access URLs

4. Create `DEPLOYMENT.md`
   - Architecture overview and diagrams
   - Security assumptions and policies
   - Network isolation guarantees
   - Offline operation requirements
   - Troubleshooting guide

5. Create `scripts/security-audit.sh`
   - Check for external network calls
   - Verify internal network configuration
   - Verify resource limits
   - Verify capabilities are dropped

6. GPU Support Verification
   - Verify NVIDIA Docker runtime is configured
   - Test GPU access in Ollama container
   - Document GPU setup for offline environments

---

### PHASE 6: Testing & Hardening (Week 4)
**Objective:** Validate security and functionality

**Tasks:**
1. Security Testing
   - Attempt to escape sandbox (file access, network calls)
   - Test timeout enforcement
   - Test resource limit enforcement
   - Test capability restrictions

2. Functional Testing
   - End-to-end code execution flow
   - Multiple concurrent code executions
   - Error handling (timeout, OOM, syntax errors)
   - Output capture and return

3. Performance Testing
   - Measure code execution latency
   - Measure container startup time
   - Measure resource usage under load

4. Network Testing
   - Verify offline operation (no external calls)
   - Verify inter-service communication
   - Verify network policies enforce isolation

5. Documentation Review
   - Verify all setup steps documented
   - Verify security assumptions clearly stated
   - Create runbooks for operators

---

## PRIORITY MATRIX

| Phase | Priority | Effort | Risk | Dependencies |
|-------|----------|--------|------|--------------|
| 1: Dockerization | CRITICAL | Medium | High (blocks other work) | None |
| 2: Sandbox Security | CRITICAL | High | High (core functionality) | Phase 1 |
| 3: Network Isolation | HIGH | Medium | High (security critical) | Phase 1, 2 |
| 4: Logging/Monitoring | MEDIUM | Medium | Low (observability only) | Phase 1 |
| 5: Deployment | MEDIUM | Low | Low (documentation) | Phases 1-4 |
| 6: Testing | MEDIUM | High | Low (validation only) | Phases 1-5 |

---

## TEAM COORDINATION NOTES

**With Person 2 (Backend API):**
- Coordinate on `run_code_in_sandbox()` function signature in tools.py
- Ensure error handling aligns with API response format
- Coordinate on CORS hardening in main.py
- Coordinate on health check endpoints

**With Person 3 (Model Router):**
- No direct dependencies; ensure ollama port isolation

**With Person 4 (Agent & Tools):**
- Work on sandbox execution function together
- Coordinate on output formatting

**With Person 5 (RAG):**
- No direct dependencies

**With Frontend Developer:**
- Coordinate on frontend Dockerfile build process
- Ensure frontend health check endpoint exists

---

## CRITICAL SECURITY ASSUMPTIONS

1. **Network Isolation:** Docker network `secure-internal` is completely air-gapped
2. **Code Execution:** All user-generated code executes ONLY in sandbox container
3. **Resource Limits:** Sandbox has enforced CPU, memory, and timeout limits
4. **Input Validation:** All code is validated before execution (no dangerous imports/functions)
5. **Logs:** All code execution is logged for audit purposes
6. **No Root Execution:** All containers run as non-root users
7. **Offline Operation:** System functions completely without internet access

---

## OPEN QUESTIONS FOR CLARIFICATION

1. **GPU Access:** Should offline deployments have GPU access? (Affects Ollama performance)
2. **Logging Backend:** Should logs be sent to ELK, Prometheus, or file-based only?
3. **Deployment Environment:** Will this run on single machine or Kubernetes cluster?
4. **Data Retention:** Should execution logs be retained indefinitely or rotated?
5. **Multi-User:** Will this support multiple concurrent users? (Affects resource limits and isolation)
6. **Code Restrictions:** Which Python libraries should be allowed? (Currently pandas, numpy, matplotlib, openpyxl)

