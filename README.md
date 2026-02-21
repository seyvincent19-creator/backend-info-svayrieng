# មន្ទីរព័ត៌មានខេត្តស្វាយរៀង - Backend

Backend API and admin panel for the Svay Rieng Provincial Information Department, built with Laravel 12, Inertia.js, and React.

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/seyvincent19-creator/backend-info-svayrieng.git
cd backend-info-svayrieng
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and update your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=svayrieng_news
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Run migrations and seeders

```bash
php artisan migrate
php artisan db:seed
```

### 5. Build frontend assets

```bash
npm run build
```

### 6. Create storage symlink

```bash
php artisan storage:link
```

## Running the Development Server

```bash
composer run dev
```

This starts all services concurrently:
- Laravel server at `http://localhost:8000`
- Vite dev server for hot module replacement
- Queue listener
- Log watcher (Pail)

Or run them separately:

```bash
php artisan serve       # Laravel backend
npm run dev             # Vite frontend
```

## Default Login Credentials

After seeding, the following accounts are available:

| Role        | Email                          | Password     |
|-------------|--------------------------------|--------------|
| Super Admin | admin@svayrieng.gov.kh         | password123  |
| Editor      | editor@svayrieng.gov.kh        | password123  |
| Author      | author@svayrieng.gov.kh        | password123  |

Admin panel: `http://localhost:8000/admin`

## API Endpoints

All public API endpoints are prefixed with `/api`:

| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/posts`              | List all posts       |
| GET    | `/api/posts/{slug}`       | Get a single post    |
| GET    | `/api/categories`         | List categories      |
| GET    | `/api/pages/{slug}`       | Get a page           |
| GET    | `/api/settings`           | Get site settings    |

## Running Tests

```bash
composer run test
```

## Tech Stack

- **Backend:** Laravel 12, Laravel Sanctum, Spatie Laravel Permission
- **Frontend:** React, Inertia.js, Vite
- **Database:** MySQL
