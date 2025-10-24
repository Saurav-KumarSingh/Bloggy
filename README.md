# Bloggy

A simple social post app where users can create, edit, delete posts, and comment on them.

## Features
- User login with JWT
- Create/edit/delete posts
- Upload images with posts
- Add/delete comments
- Dashboard showing user info and posts

## Tech Stack
- Frontend: React, Axios, React Router, Tailwind CSS  
- Backend: Spring Boot, Spring Security, JWT, MySQL

## Setup

### Backend
```bash
cd bloggy-backend
./mvnw spring-boot:run
```
###Frontend
```
cd frontend
npm install
npm run dev
```

###ScreenShot
Here’s a glimpse of **BuyIt** in action:

<p align="center">
  <img src="./screenshot/login.png" alt="Homepage" width="45%" height="250px" style="margin: 20px; object-fit: cover;" />
  <img src="./screenshot/home.png" alt="Auth Page" width="45%" height="250px" style="margin: 20px; object-fit: cover;" />

  <img src="./screenshot/create_post.png" alt="Collection Page" width="45%" height="250px" style="margin: 20px; object-fit: cover;" />
  <img src="./screenshot/edit_post.png" alt="Admin Page" width="45%" height="250px" style="margin: 20px; object-fit: cover;" />

  <img src="./screenshot/dashboard.png" alt="Product Detail Page" width="45%" height="250px" style="margin: 20px; object-fit: cover;" />
</p>
