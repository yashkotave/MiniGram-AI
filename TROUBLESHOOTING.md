# 🔧 MiniGram-AI - Authentication Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot Connect to API" / "Network Error"

**Symptoms:**
- "Failed to fetch" errors
- Network timeout errors
- Cannot POST to http://localhost:3000/api/auth/register

**Solutions:**

1. **Check Backend is Running**
   ```bash
   # Open terminal and check if backend is running
   Get-Process -Name node | Where-Object {$_.CommandLine -like "*backend*"}
   
   # If not running, start it:
   cd d:\MY SPACE\MERN PROJECTS\BASIC FULL STACK\MiniGram-AI\Backend
   npm run dev
   ```

2. **Check MongoDB is Running**
   ```bash
   Get-Process mongod
   # Should show: mongod process is running
   # If not, start MongoDB
   ```

3. **Verify API URL in Frontend**
   - Open `Frontend\.env`
   - Check: `VITE_API_URL=http://localhost:3000/api`
   - Should match backend URL

4. **Check CORS Configuration**
   - Verify backend allows localhost:5173
   - Check `Backend\app.js` has CORS middleware enabled

---

### Issue 2: "Email Already Registered"

**Symptoms:**
- After registration successful, get 400 "Email already registered" on retry

**Solution:**
- Use a NEW email address each time
- OR login with existing email/password if account exists

---

### Issue 3: "Passwords Do Not Match"

**Symptoms:**
- Registration fails with "Passwords do not match"

**Solution:**
- Verify both password fields are EXACTLY the same
- Check caps lock is OFF
- Special characters must match exactly

---

### Issue 4: "Invalid Email Format"

**Symptoms:**
- Registration fails: "Invalid email format"

**Solution:**
- Email must be proper format: `name@domain.com`
- Must have @ symbol and domain
- Cannot have spaces

---

### Issue 5: "Username Already Taken"

**Symptoms:**
- Registration fails: "Username already taken"

**Solution:**
- Choose a different username
- Username should be 3-30 characters
- Only letters, numbers, and underscore allowed

---

### Issue 6: "Login - Invalid Credentials"

**Symptoms:**
- Login fails: "Invalid credentials"
- User exists but cannot login

**Solutions:**

1. **Verify Email is Correct**
   - Use the EXACT email you registered with
   - Email is case-insensitive for login

2. **Verify Password is Correct**
   - Password is CASE-SENSITIVE
   - Check caps lock
   - No extra spaces before/after

3. **Account May Not Exist**
   - Create new account using registration form
   - Try with test credentials provided

---

### Issue 7: "Loading Forever" / "Request Hangs"

**Symptoms:**
- Submit form and nothing happens
- Loading spinner appears but doesn't complete
- Request times out after 10+ seconds

**Solutions:**

1. **Backend May Be Crashed**
   ```bash
   # Check terminal for errors
   # If crashed, restart:
   Get-Process node | Stop-Process
   cd Backend
   npm run dev
   ```

2. **Check Console for Errors**
   - Press F12 to open Developer Tools
   - Go to Console tab
   - Look for red error messages
   - Take screenshot and debug

3. **MongoDB Connection Issue**
   ```bash
   # Verify MongoDB is connected
   Get-Process mongod
   # Check backend logs for "Connected to MongoDB"
   ```

---

## 🐛 Advanced Debugging

### Step 1: Open Developer Console
1. Press **F12** on your keyboard
2. Click **Console** tab
3. Look for any red/yellow errors

### Step 2: Check Network Requests
1. Press **F12** → **Network** tab
2. Try to register/login
3. Look for requests to `localhost:3000/api/auth/...`
4. Click each request to see response

### Step 3: Check Browser Console Logs
Look for messages like:
```
✅ [API Request] POST http://localhost:3000/api/auth/register
✅ [Auth] Register attempt: { username: '...', email: '...' }
❌ [Auth] Error: Email already registered
```

These logs show exactly what's happening!

---

## 📋 Checklist Before Login/Registration

- [ ] Backend is running (`npm run dev` in Backend folder)
- [ ] MongoDB is running
- [ ] Frontend is running at http://localhost:5173
- [ ] Backend is running at http://localhost:3000
- [ ] Email is valid format (name@domain.com)
- [ ] Username is 3-30 characters, only letters/numbers/underscore
- [ ] Password is minimum 6 characters
- [ ] Password fields match exactly (case-sensitive)
- [ ] No trailing spaces in any field

---

## 🧪 Manual Testing

### Test Registration via PowerShell
```powershell
$body = @{
    username = "testuser$(Get-Random -Min 100 -Max 999)"
    email = "test$(Get-Random -Min 10000 -Max 99999)@test.com"
    password = "Password123"
    passwordConfirm = "Password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

### Test Login via PowerShell
```powershell
$body = @{
    email = "your-email@test.com"
    password = "yourpassword"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

---

## 📞 Quick Recovery Steps

### If Nothing Works:

1. **Stop everything:**
   ```bash
   Get-Process node, mongod | Stop-Process -Force
   ```

2. **Clean start backend:**
   ```bash
   cd d:\MY SPACE\MERN PROJECTS\BASIC FULL STACK\MiniGram-AI\Backend
   npm run dev
   ```

3. **Clean start frontend:**
   ```bash
   cd d:\MY SPACE\MERN PROJECTS\BASIC FULL STACK\MiniGram-AI\Frontend
   npm run dev
   ```

4. **Hard refresh browser:**
   - Press **Ctrl + Shift + R** (Windows)
   - Or Cmd + Shift + R (Mac)

5. **Try again with fresh credentials:**
   - New username
   - New email address
   - Valid passwords

---

## ✅ Verify It's Working

After you see these messages, login/registration is working:

**In Browser Console:**
```
✅ [API Request] POST http://localhost:3000/api/auth/register 201
✅ [API Response] 201 { success: true, ... }
✅ [Auth] Registration successful
```

**In Browser:**
```
✅ "Account created successfully! Welcome to MiniGram"
OR
✅ "Welcome back! Redirecting..."
```

**Then you'll see:**
- Redirect to `/profile` page
- Your username displayed
- Ability to create posts

---

## 🆘 Still Having Issues?

**Check these logs:**

1. **Browser Console (F12):**
   - Look for red errors
   - Check API request responses
   - Copy exact error message

2. **Backend Terminal:**
   - Look for database connection errors
   - Look for validation errors
   - Look for "Register error:" or "Login error:"

3. **Network Tab (F12 → Network → auth/register):**
   - See exact request sent
   - See exact response received
   - Status code (201 = success, 400 = validation error, 500 = server error)

---

## 📝 Test Account Available

If you just want to test without creating account:
```
Email:    johndoe75730@minigram.com
Username: johndoe819
Password: Test@123456
```

---

**Status**: ✅ All systems operational  
**Last Updated**: February 12, 2026

Get help by checking the console logs and following the debugging steps above!
