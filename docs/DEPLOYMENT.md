# 🚀 DEPLOYMENT GUIDE - ECOMMERCE_SHOP

> **Production-Ready Deployment Guide**
> **Infrastructure**: MySQL + Node.js + React (Vite)

---

## 📋 MỤC LỤC

1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [Deployment Backend](#2-deployment-backend)
3. [Deployment Frontend](#3-deployment-frontend)
4. [Database Migration](#4-database-migration)
5. [Docker Deployment](#5-docker-deployment)
6. [Environment Variables](#6-environment-variables)
7. [Monitoring & Logging](#7-monitoring--logging)

---

## 1. YÊU CẦU HỆ THỐNG

### Production Server Requirements

**Minimum Specifications:**
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04 LTS hoặc mới hơn

**Software Requirements:**
- Node.js >= 18.x
- MySQL >= 8.0
- nginx >= 1.18 (web server)
- PM2 (process manager)
- SSL Certificate (Let's Encrypt)

---

## 2. DEPLOYMENT BACKEND

### 2.1 Chuẩn bị Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL Server
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PM2 globally
sudo npm install -g pm2

# Install nginx
sudo apt install nginx -y
```

### 2.2 Deploy Backend Application

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> ecommerce-shop
cd ecommerce-shop/apps/backend

# Install dependencies
npm ci --production

# Setup environment variables
sudo nano .env.production
# (Copy content từ section 6)

# Build TypeScript
npm run build

# Run database migrations
npm run migration:run

# Start application with PM2
pm2 start dist/main.js --name ecommerce-backend
pm2 save
pm2 startup
```

### 2.3 nginx Configuration for Backend

**File**: `/etc/nginx/sites-available/api.ecommerce-shop.com`

```nginx
server {
    listen 80;
    server_name api.ecommerce-shop.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable site:**

```bash
sudo ln -s /etc/nginx/sites-available/api.ecommerce-shop.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2.4 SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.ecommerce-shop.com
```

---

## 3. DEPLOYMENT FRONTEND

### 3.1 Build Frontend

```bash
cd /var/www/ecommerce-shop/apps/frontend

# Install dependencies
npm ci

# Setup environment variables
nano .env.production
# VITE_API_URL=https://api.ecommerce-shop.com/api

# Build for production
npm run build
# Output: dist/
```

### 3.2 nginx Configuration for Frontend

**File**: `/etc/nginx/sites-available/ecommerce-shop.com`

```nginx
server {
    listen 80;
    server_name ecommerce-shop.com www.ecommerce-shop.com;

    root /var/www/ecommerce-shop/apps/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Enable site:**

```bash
sudo ln -s /etc/nginx/sites-available/ecommerce-shop.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d ecommerce-shop.com -d www.ecommerce-shop.com
```

---

## 4. DATABASE MIGRATION

### 4.1 Tạo Database

```bash
sudo mysql -u root -p

# Trong MySQL shell:
CREATE DATABASE ecommerce_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'StrongPassword@123';
GRANT ALL PRIVILEGES ON ecommerce_shop.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4.2 Import Schema

```bash
cd /var/www/ecommerce-shop
mysql -u ecommerce_user -p ecommerce_shop < database_setup.sql
```

### 4.3 Seed Data

```bash
cd apps/backend
npm run seed:all
```

---

## 5. DOCKER DEPLOYMENT

### 5.1 Docker Compose Configuration

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: ecommerce-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ecommerce_shop
      MYSQL_USER: ecommerce_user
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database_setup.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - ecommerce-network

  # Backend API
  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    container_name: ecommerce-backend
    restart: always
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=ecommerce_user
      - DB_PASSWORD=${MYSQL_PASSWORD}
      - DB_NAME=ecommerce_shop
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    networks:
      - ecommerce-network
    volumes:
      - ./apps/backend/uploads:/app/uploads

  # Frontend
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    container_name: ecommerce-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - ecommerce-network

volumes:
  mysql_data:

networks:
  ecommerce-network:
    driver: bridge
```

### 5.2 Backend Dockerfile

**File**: `apps/backend/Dockerfile`

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production=false

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
```

### 5.3 Frontend Dockerfile

**File**: `apps/frontend/Dockerfile`

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Production image with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**File**: `apps/frontend/nginx.conf`

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.4 Deploy với Docker

```bash
# Tạo .env file
cp .env.example .env
# Edit .env với giá trị production

# Build và start containers
docker-compose up -d --build

# Kiểm tra logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

## 6. ENVIRONMENT VARIABLES

### 6.1 Backend Environment (.env.production)

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=ecommerce_user
DB_PASSWORD=YourStrongPassword@123
DB_NAME=ecommerce_shop

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production

# CORS
FRONTEND_URL=https://ecommerce-shop.com

# Upload
UPLOAD_DIR=/var/www/ecommerce-shop/uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_TTL=900
RATE_LIMIT_MAX=100

# Redis (optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 6.2 Frontend Environment (.env.production)

```bash
VITE_API_URL=https://api.ecommerce-shop.com/api
VITE_UPLOAD_URL=https://api.ecommerce-shop.com/uploads
VITE_APP_NAME=Ecommerce Shop
```

### 6.3 Docker Environment (.env)

```bash
# MySQL
MYSQL_ROOT_PASSWORD=RootPassword@123
MYSQL_PASSWORD=EcommerceDBPass@456

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
```

---

## 7. MONITORING & LOGGING

### 7.1 PM2 Monitoring

```bash
# View logs
pm2 logs ecommerce-backend

# Monitor resources
pm2 monit

# Web dashboard
pm2 web
```

### 7.2 nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 7.3 MySQL Slow Query Log

```bash
# Enable slow query log
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add:
# slow_query_log = 1
# slow_query_log_file = /var/log/mysql/slow-query.log
# long_query_time = 2

sudo systemctl restart mysql
```

### 7.4 Log Rotation

**File**: `/etc/logrotate.d/ecommerce-shop`

```
/var/www/ecommerce-shop/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## 8. BACKUP STRATEGY

### 8.1 Database Backup Script

**File**: `/opt/scripts/backup-db.sh`

```bash
#!/bin/bash

BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
DB_NAME="ecommerce_shop"
DB_USER="ecommerce_user"
DB_PASS="YourPassword"

mkdir -p $BACKUP_DIR

mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/$DB_NAME-$DATE.sql.gz

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

**Setup cron job:**

```bash
sudo crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup-db.sh
```

---

## 9. SECURITY CHECKLIST

- ✅ Firewall enabled (ufw)
- ✅ SSH key authentication only
- ✅ Disable root SSH login
- ✅ SSL/TLS certificates installed
- ✅ Database không expose ra public
- ✅ Environment variables secured
- ✅ Rate limiting enabled
- ✅ CORS properly configured
- ✅ Regular security updates
- ✅ Backup automated

---

## 10. HEALTH CHECKS

### 10.1 Backend Health Endpoint

```bash
curl https://api.ecommerce-shop.com/health
# Expected: {"status":"ok","timestamp":"2026-01-20T10:00:00.000Z"}
```

### 10.2 Frontend Availability

```bash
curl -I https://ecommerce-shop.com
# Expected: HTTP/2 200
```

---

## 📞 SUPPORT

**Technical Issues**: dev@ecommerce-shop.com
**Emergency**: +84-xxx-xxx-xxx

**Documentation**: https://docs.ecommerce-shop.com
**Status Page**: https://status.ecommerce-shop.com

---

**Last Updated**: 2026-01-20
**Maintained By**: DevOps Team
