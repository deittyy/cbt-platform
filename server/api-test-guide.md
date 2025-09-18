# CBT Platform API Testing Guide

Your server is running! Here are the correct endpoints and how to test them:

## 🌐 Server Info
- **Base URL**: http://localhost:5000
- **Status**: ✅ Running

## 📋 Available API Routes

### 1. **Root Endpoint**
```
GET http://localhost:5000/
```
❌ **Expected**: "Route not found" (no root route defined)

### 2. **Admin Routes** (require admin authentication)
```
GET http://localhost:5000/api/questions
POST http://localhost:5000/api/questions
GET http://localhost:5000/api/questions/:id
PUT http://localhost:5000/api/questions/:id
DELETE http://localhost:5000/api/questions/:id
```

### 3. **Student Routes** (require student authentication)
```
GET http://localhost:5000/api/tests/available
GET http://localhost:5000/api/tests/start/:courseId
POST http://localhost:5000/api/tests/submit/:courseId
```

### 4. **Results Routes**
```
GET http://localhost:5000/api/results/student
GET http://localhost:5000/api/results/student/:resultId
GET http://localhost:5000/api/results/student/download/csv
```

### 5. **Course Routes**
```
GET http://localhost:5000/api/courses
POST http://localhost:5000/api/courses
```

### 6. **Auth Routes**
```
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/auth/register
```

## 🧪 Quick Test Commands

### Test if server is responding:
```bash
curl http://localhost:5000/api/auth/login
```

### Test with PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"test"}'
```

## 🔐 Authentication Required

Most routes require authentication. You need to:
1. Login first to get a JWT token
2. Include the token in your requests

## 💡 Why "Route not found"?

If you're getting "route not found", you're probably:
1. Accessing the root URL (http://localhost:5000) - this is expected
2. Missing the `/api/` prefix in your URLs
3. Not including proper authentication headers

## ✅ Correct Test URLs:
- ✅ http://localhost:5000/api/auth/login
- ❌ http://localhost:5000/auth/login (missing /api/)
- ❌ http://localhost:5000/ (no root route)