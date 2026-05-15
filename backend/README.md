# Laravel Workspace (backend)

This folder contains a Docker-based scaffold to run a Laravel application.

Prerequisites
- Docker & Docker Compose OR PHP + Composer locally installed.

Quick setup using Docker Compose

1. Create a new Laravel project in `backend/app` using the composer container:

```bash
docker-compose -f backend/docker-compose.yml run --rm composer create-project laravel/laravel:^10 app
```

2. Start services:

```bash
docker-compose -f backend/docker-compose.yml up -d
```

3. Set permissions and generate app key:

```bash
docker-compose -f backend/docker-compose.yml exec app bash -lc "cd /var/www && composer install && php artisan key:generate && chown -R www-data:www-data storage bootstrap/cache"
```

4. Open http://localhost:8080

Alternative: Create the project locally using Composer:

```bash
composer create-project laravel/laravel backend/app
cd backend/app
php artisan serve --host=0.0.0.0 --port=8000
```

Notes
- Nginx config is at `backend/nginx/default.conf`.
- PHP settings at `backend/php.ini`.
- Database runs on MySQL `laravel_db` on port 3306 (root:secret).

If you want, I can run the composer create-project step now (requires Docker)."