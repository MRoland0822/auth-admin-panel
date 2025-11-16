# Docker Commands Reference

## Starting the Database
```bash
# Start in detached mode
docker-compose up -d

# Start and view logs
docker-compose up
```

## Stopping the Database
```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v
```

## Viewing Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f postgres
```

## Database Access
```bash
# Connect to PostgreSQL CLI
docker exec -it auth_admin_postgres psql -U admin -d auth_admin_db

# Common psql commands:
# \l          - List databases
# \dt         - List tables
# \d <table>  - Describe table structure
# \q          - Quit
```

## Troubleshooting

### Port 5432 already in use
```bash
# Stop local PostgreSQL if installed
sudo service postgresql stop  # Linux
brew services stop postgresql  # Mac

# Or change the port in docker-compose.yml:
# ports:
#   - '5433:5432'  # Use 5433 on host instead
```

### Container won't start
```bash
# View detailed logs
docker-compose logs postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Reset everything
```bash
# Nuclear option - fresh start
docker-compose down -v
docker volume prune
docker-compose up -d
```

## Database Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** auth_admin_db
- **Username:** admin
- **Password:** admin123
- **Connection URL:** postgresql://admin:admin123@localhost:5432/auth_admin_db