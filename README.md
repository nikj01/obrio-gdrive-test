# File Transfer Service

A service for uploading files to Google Drive via HTTP requests with an array of file links.

## Description

The service allows processing an array of file URLs and uploading these files to Google Drive. It's a kind of transfer service: you provide it with a file link - it uploads the file to Google Drive. There's a possibility to run three service replicas with load balancing.

Google Drive integration is implemented through an adapter, so theoretically there's a possibility to replace it with another storage, for example, AWS S3.

## Technology Stack

- **Backend**: Node.js, NestJS
- **Database**: PostgreSQL, Prisma ORM
- **Queue**: Redis, BullMQ
- **Storage**: Google Drive API
- **Documentation**: Swagger
- **Load Balancing**: Nginx
- **Containerization**: Podman, Podman Compose

## Features

- HTTP API for uploading files by array of links
- Asynchronous processing of large files
- API for retrieving list of uploaded files
- Scalability with multiple replicas support
- Load balancing between replicas

## Installation and Setup

### Prerequisites

1. Docker and Docker Compose (or Podman)
2. Configured Google Cloud project with Google Drive API
3. Google service account with access keys

### Google Drive Setup

1. Create a project in Google Cloud Console
2. Enable Google Drive API
3. Create a service account
4. Generate and download access keys
5. Rename the keys file and place it into the project's root `keys/gdrive.keys.json`
6. Create a folder on Google Drive
7. Share the folder with your service account
8. Save the folder ID in the `.env` file

Detailed guide: https://dev.to/mearjuntripathi/upload-files-on-drive-with-nodejs-15j2

### Environment Variables Setup

Copy the example `.env` file and specify:
- `GOOGLE_DRIVE_FOLDER_ID` - Google Drive folder ID
- Other variables as needed

**Important**: If running the service locally (not in container), change in `.env`:
- `DATABASE_URL` to `localhost`
- `REDIS_HOST` to `localhost`

### Launch Options

#### Option 1: Dev Container (recommended for development)

The project includes Dev Container configuration in the `.devcontainer` folder:

1. Open the project in WebStorm or VSCode
2. Launch Dev Container
3. The service will be started as a single instance with all necessary environment

**Note**: Configuration tested with Podman

#### Option 2: Docker Compose (recommended for staging/production)

```bash
# Launch with single replica
docker-compose up

# Launch with three replicas (with load balancer)
docker-compose up --scale files-service=3
```

**Note**: Compose file tested with Podman

## API Endpoints

API documentation is available through Swagger UI after starting the service on `http://localhost:1080/swagger#`.

### Main endpoints:

- `POST /files` - upload files by array of links
- `GET /files/{ownerId}` - get list of uploaded files for a specific owner

## Testing

E2E tests should be available as a collection [here](https://red-desert-824312.postman.co/workspace/OBRIO-test-task~44a777f3-3c47-479e-ab40-27e6a4d6320a/collection/22715560-39688144-0c08-4032-9814-e4e8b6cab197?action=share&creator=46562933).
You can also try the API by using Swagger.

## Development

For local development, it's recommended to use Dev Container, which includes all necessary dependencies and configurations.