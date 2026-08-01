# VidyaSetu Node.js Backend

A clean, scalable, and secure Node.js Express backend using MySQL, JWT authentication, role authorization, Swagger UI documentation, and dual file upload strategy (Local `public/uploads` & AWS S3 option).

---

## 📁 Architecture & Folder Structure

```text
backend/
├── .env.example            # Environment variables template
├── package.json            # Backend dependencies & scripts
├── schema.sql              # MySQL DDL table scripts & seed data
├── public/                 # Local uploaded files folder
│   └── uploads/            # Student avatars and document assets
├── src/
│   ├── config/
│   │   ├── db.js           # MySQL2 connection pool setup
│   │   └── upload.js       # Dual strategy Multer upload (Local / S3)
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── class.controller.js
│   │   ├── section.controller.js
│   │   └── setting.controller.js
│   ├── docs/
│   │   └── swagger.json    # OpenAPI 3.0 Swagger specs
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT & role authorization
│   │   ├── validate.middleware.js # Input validators
│   │   └── error.middleware.js    # Centralized error handler
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── class.routes.js
│   │   ├── section.routes.js
│   │   └── setting.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── student.service.js
│   │   ├── class.service.js
│   │   ├── section.service.js
│   │   └── setting.service.js
│   ├── utils/
│   │   ├── logger.js       # Structured logger
│   │   └── response.js     # Consistent response formatter
│   ├── app.js              # Express app initialization & route mounting
│   └── server.js           # Entry point execution
```

---

## 🗄️ Database Migrations & Seeders (MySQL)

You can run automated JavaScript database migrations and seeders using npm commands:

### 1. Run Database Migrations
Creates the `sahara_academy` database and all required tables (`users`, `classes`, `sections`, `students`, `school_settings`):
```bash
npm run db:migrate
```

### 2. Run Data Seeders
Populates default admin user, class levels, sections, sample student records, and school settings:
```bash
npm run db:seed
```

### 3. Setup Both (Migration + Seeding)
Runs migrations followed by seeding in a single command:
```bash
npm run db:setup
```

Or manually import `schema.sql`:
```bash
mysql -u root -p < schema.sql
```

Default Admin Credentials:
- **Email**: `admin@sahara.edu`
- **Password**: `admin123`

---

## 🚀 Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your MySQL credentials and desired file storage strategy:
- To use local uploads (`backend/public/uploads`): `STORAGE_TYPE=local`
- To use AWS S3 bucket uploads: `STORAGE_TYPE=s3` and fill `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `AWS_S3_BUCKET_NAME`.

---

## ⚡ Running the Backend

Install dependencies and start dev mode:
```bash
cd backend
npm install
npm run dev
```

The backend server runs at: `http://localhost:3000`

---

## 📖 Swagger API Documentation

Open Swagger UI in your browser at:
👉 **`http://localhost:3000/api-docs`**

Swagger allows interactive testing of:
- `POST /api/auth/login` - JWT Authentication
- `GET /api/students` - View paginated student list
- `POST /api/students` - Add or single upsert student
- `PUT /api/students/{id}` - Update student record
- `DELETE /api/students/{id}` - Delete student record
- `GET /api/students/{id}` - View student details
- `GET /api/classes` - View classes
- `GET /api/sections` - View sections
- `GET /api/settings` - View settings
- `PUT /api/settings` - Update settings
