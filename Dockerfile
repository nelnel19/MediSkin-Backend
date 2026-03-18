FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for TensorFlow
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Verify TensorFlow installation
RUN python -c "import tensorflow as tf; print(f'TensorFlow version: {tf.__version__}')"

COPY . .

# Create models directory if it doesn't exist
RUN mkdir -p /app/models

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]