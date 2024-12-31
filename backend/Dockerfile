# Use the official lightweight Python image.
FROM python:3.10.0-alpine

# Set the working directory in the container.
WORKDIR /backend

# Install any necessary dependencies.
RUN apk add --no-cache build-base libffi-dev

# Copy the requirements file into the container at /backend.
COPY requirements.txt /backend/

# Install any dependencies specified in requirements.txt.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the working directory contents into the container at /backend.
COPY . .

# Make port 8000 available to the world outside this container.
EXPOSE 8080

# Define environment variable
ENV NAME World

# Run the application.
CMD ["python", "-m", "app.main"]