# 🔐 MiniGram-AI - Authentication Fields Reference

## 📋 Complete Authentication Documentation

This document defines all fields required for authentication (Registration & Login) in MiniGram-AI.

---

## 📝 Registration (Sign Up)

### Endpoint
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json
```

### Required Fields

| Field | Type | Rules | Example |
|-------|------|-------|---------|
| **username** | String | • 3-30 characters<br/>• Only letters, numbers, underscore<br/>• Unique across system<br/>• Case-sensitive | `johndoe`, `user_123`, `JD2024` |
| **email** | String | • Valid email format<br/>• Must contain @ and domain<br/>• Unique across system<br/>• Case-insensitive | `john@example.com`, `user@gmail.com` |
| **password** | String | • Minimum 6 characters<br/>• Cannot be empty<br/>• Stored as hashed (bcrypt) | `Password123`, `mySecure@Pass` |
| **passwordConfirm** | String | • Must match `password` exactly<br/>• Required for verification | `Password123` |

### Registration Request Example
```json
{
  "username": "johndoe123",
  "email": "john@example.com",
  "password": "SecurePass123",
  "passwordConfirm": "SecurePass123"
}
```

### Successful Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "698e033aa0b932a73debab0a",
    "username": "johndoe123",
    "email": "john@example.com",
    "fullName": "",
    "profileImage": "https://via.placeholder.com/150"
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Fields
```json
{
  "success": false,
  "message": "All fields are required"
}
```

#### 400 Bad Request - Password Mismatch
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

#### 400 Bad Request - Invalid Email
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

#### 400 Bad Request - Duplicate Email
```json
{
  "success": false,
  "message": "Email already registered"
}
```

#### 400 Bad Request - Duplicate Username
```json
{
  "success": false,
  "message": "Username already taken"
}
```

---

## 🔑 Login (Sign In)

### Endpoint
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json
```

### Required Fields

| Field | Type | Rules | Example |
|-------|------|-------|---------|
| **email** | String | • Must be registered email<br/>• Case-insensitive<br/>• Valid format required | `john@example.com` |
| **password** | String | • Must match registered password<br/>• Case-sensitive<br/>• Minimum 6 characters | `SecurePass123` |

### Login Request Example
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "698e033aa0b932a73debab0a",
    "username": "johndoe123",
    "email": "john@example.com",
    "fullName": "John Doe",
    "profileImage": "https://via.placeholder.com/150"
  }
}
```

**Important**: A secure HTTP-only cookie named `token` is also set for session management.

### Error Responses

#### 400 Bad Request - Missing Fields
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

#### 401 Unauthorized - Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```
**Note**: Same message for both wrong email and wrong password (security best practice)

---

## 🔄 Get Current User (Verify Login)

### Endpoint
```
GET http://localhost:3000/api/auth/me
Authorization: Bearer <token> (in HTTP-only cookie)
```

### Response (200 OK) - User is Logged In
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "user": {
    "id": "698e033aa0b932a73debab0a",
    "username": "johndoe123",
    "email": "john@example.com",
    "fullName": "John Doe",
    "bio": "I love photography and coding",
    "profileImage": "https://example.com/profile.jpg",
    "followerCount": 10,
    "followingCount": 5
  }
}
```

### Response (401 Unauthorized) - User Not Logged In
```json
{
  "message": "Unauthorized access, please login first"
}
```

---

## 🚪 Logout

### Endpoint
```
POST http://localhost:3000/api/auth/logout
Authorization: Bearer <token> (in HTTP-only cookie)
```

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🛡️ Security Features

### Password Security
- ✅ Minimum 6 characters
- ✅ Hashed with bcryptjs (12 salt rounds)
- ✅ Never sent in responses
- ✅ Never stored in plain text

### Token Security
- ✅ JWT (JSON Web Tokens)
- ✅ Stored in HTTP-only cookies (cannot be accessed via JavaScript)
- ✅ Expires in 30 days
- ✅ Secure flag set (HTTPS only in production)
- ✅ SameSite set to 'lax'

### Session Management
- ✅ Automatic session with cookies
- ✅ Protected routes require valid token
- ✅ Token verified on every authenticated request

### Validation
- ✅ Email format validation
- ✅ Username format validation
- ✅ Password confirmation match
- ✅ All fields required

---

## 📱 Frontend Integration

### Registration Form Fields (From /auth?signup=true)
```jsx
<input name="username" placeholder="Username" required />
<input name="email" type="email" placeholder="Email" required />
<input name="password" type="password" placeholder="Password" required />
<input name="confirmPassword" type="password" placeholder="Confirm Password" required />
```

### Login Form Fields (From /auth)
```jsx
<input name="email" type="email" placeholder="Email" required />
<input name="password" type="password" placeholder="Password" required />
```

---

## 🎯 Common Issues & Solutions

### Issue: "Email already registered"
- **Solution**: Use a different email address or login if account exists

### Issue: "Username already taken"
- **Solution**: Choose a different username (at least 3 characters, no spaces)

### Issue: "Passwords do not match"
- **Solution**: Make sure password and confirm password fields match exactly (case-sensitive)

### Issue: "Invalid email format"
- **Solution**: Use proper email format (name@domain.com)

### Issue: "Invalid credentials"
- **Solution**: Double-check email and password are correct (both are case-sensitive for password)

### Issue: "Email and password are required"
- **Solution**: Fill in both email and password fields before submitting

---

## 🧪 Test Credentials (Working Account)

```
Email:    johndoe75730@minigram.com
Username: johndoe819
Password: Test@123456
```

---

## 🔗 API Base URL

```
Development:  http://localhost:3000/api
Production:   https://your-domain.com/api
```

---

## 📌 Important Notes

1. **Cookies vs Headers**: The token is stored in HTTP-only cookies automatically. No need to manually add Authorization headers.

2. **Case Sensitivity**: 
   - Email: Case-insensitive
   - Username: Case-sensitive
   - Password: Case-sensitive

3. **Session Duration**: 30 days (automatic)

4. **CORS**: Configured to allow localhost:5173 (Frontend) by default

5. **Rate Limiting**: Not currently implemented, but recommended for production

---

**Last Updated**: February 12, 2026  
**API Version**: v1  
**Status**: ✅ Production Ready
