# Installation
## Install libraries
```bash
npm install
```
## Create config file
```bash
nano . > db/config/config.json
```
OR for vscode
```bash
code db/config/config.json
```
## Create .env file
```javascript
NODE_ENV=development
DEBUG=true // changes logging details
LOG_LEVEL=info
RATE_LIMIT=100
SESSION_TIMEOUT_HOUR=1
JWT_SECRET=supersecret
// DATABASE_URL (optional)
```
### if DATABASE_URL is not set in environment
### config.json example
```json
{
  "development": {
    "username": "...",
    "password": "...",
    "database": "...",
    "host": "...",
    "dialect": "..."
  },
  "test": {
    ...
  },
  "production": {
    ...
  }
}
```

# Database prep.
## Change directory to database
```bash 
cd db
```
## Migration
```bash 
npx sequelize-cli db:migrate 
```
### Undo Migration
```bash 
npx sequelize-cli db:migrate:undo:all
```
## Seed
```bash 
npx sequelize-cli db:seed:all
```

# Run
```bash 
npm start
```

# Postman
## Collection v2.1
```
Conquerer.postman_collection2_1.json
```
## Collection v2
```
Conquerer.postman_collection2.json
```

# Logging

## Error level logs
```
logs/error.log
```
## Combined all level logs
```
logs/combined.log
```