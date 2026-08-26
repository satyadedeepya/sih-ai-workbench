# PERSON 6: DEVOPS, SANDBOX & SECURITY LEAD
# 
# TODOs for Sandbox Dockerfile:
# 1. This container will run the generated Python code securely.
# 2. It must have NO internet access.
# 3. It should be a lightweight Python image.
# 4. Only install necessary data science / analysis libraries (pandas, numpy, etc.).

FROM python:3.10-slim

# Create a non-root user for execution
RUN useradd -m sandboxuser
USER sandboxuser
WORKDIR /home/sandboxuser

# Copy a requirements file if needed, or install base packages
RUN pip install pandas numpy matplotlib openpyxl --no-cache-dir

# The sandbox will receive code via standard input or a mounted volume
CMD ["python", "execute_code.py"]
