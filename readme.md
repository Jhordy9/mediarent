# MediaRent

## System Requirements

- Docker
- Node.js (version 18 or later)

## Installation

1. **Install Docker:**
   - Follow the instructions at [Get Docker](https://docs.docker.com/get-docker/).

2. **Install Node.js:**
   - Node.js can be downloaded from [Node.js official website](https://nodejs.org/en/download/).

3. **Create Environment File:**
   - Copy the `env.example` file and create a new file named `.env` in the project root.

     ```bash
     cp env.example .env
     ```

## Running the Application

```bash
make up
```

### Stop and Remove Containers

```bash
make down
```
