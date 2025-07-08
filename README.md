# 🔐 Lockify Test Server

Lockify Test Server is a simple API for testing authentication features with Express.js.

## 🚀 Installation and startup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the server:**
   ```bash
   npm start
   ```
   The server starts on [http://localhost:3000](http://localhost:3000).

## 📋 API Endpoints

- **GET /** : API documentation
- **POST /register** : User registration
- **POST /login** : User login
- **GET /profile** : Profile access (requires token)
- **POST /verify-token** : Manual token verification
- **GET /users** : View all users (debug)
- **DELETE /users/:id** : Delete user by ID
- **DELETE /users/email/:email** : Delete user by email
- **DELETE /users** : Delete all users

## 🛠 Usage

### Registration
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"MyPassword123!"}'
```

### Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"MyPassword123!"}'
```

### Profile access
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📂 Project structure

- `app.ts`: Main server
- `users.json`: User storage
- `package.json`: npm configuration
