# PetTrack
# Build and start all services
docker-compose up -d

# Build and start with rebuild (if Dockerfile changed)
docker-compose up -d --build

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Run specific service
docker-compose up backend

# Execute command in running container
docker-compose exec backend sh
docker-compose exec frontend sh