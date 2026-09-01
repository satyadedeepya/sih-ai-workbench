FROM python:3.10-slim

# Create a non-root user for execution
RUN useradd -m sandboxuser

# Set working directory
WORKDIR /home/sandboxuser/sandbox

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create cache directory (will be tmpfs-mounted in docker-compose)
RUN mkdir -p /home/sandboxuser/.cache && \
    chmod 700 /home/sandboxuser/.cache

# Copy sandbox application code
COPY security_policies.py .
COPY execute_code.py .
COPY runner.py .

# Change ownership to sandboxuser
RUN chown -R sandboxuser:sandboxuser /home/sandboxuser

# Switch to non-root user
USER sandboxuser

# Expose internal port (only accessible within Docker network)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health').read()" || exit 1

# Run the HTTP server
CMD ["python3", "runner.py"]

