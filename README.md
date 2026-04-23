# Mini Lead Tracker

## 🚀 Tech Stack
- Next.js
- NestJS
- PostgreSQL
- Prisma
- Docker

---

## 📦 Project Structure

backend/ – NestJS API  
frontend/ – Next.js app  

---

## 🛠️ Local Setup

### Backend
cd backend
npm install
npm run start:dev

### Frontend
cd frontend
npm install
npm run dev

---

## 🐳 Docker

docker compose up --build

---

## 🔧 Environment Variables

See:
- backend/.env.example
- frontend/.env.example

---

## API

GET /api/leads  
POST /api/leads  

Swagger:
http://localhost:3000/api/docs

---

## API Examples

### Get leads
GET /api/leads?q=john&status=NEW&page=1&limit=10

### Create lead
POST /api/leads

{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme",
  "status": "NEW"
}

### Add comment
POST /api/leads/:id/comments

{
  "text": "Called the client, waiting for response"
}

---

## Features

- CRUD for leads
- Comments for each lead
- Search, filter, pagination
- Status management
- Clean API with validation

---

## 🔗 Live Demo

Frontend: ...  
Backend: ...

---

## What could be improved

Due to time constraints, the following could be improved:

- Add unit/integration tests (Jest)
- Improve UI/UX (better form validation, notifications)
- Add debounced search to reduce API calls
- Optimize backend queries and add indexing
