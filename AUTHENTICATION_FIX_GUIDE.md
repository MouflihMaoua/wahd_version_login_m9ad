# 🔧 **Authentication Error Fix Guide**

## ❌ **Current Problem**
```
POST https://yybiancphbjcexvtilyd.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
Authentication error: Error: Invalid login credentials
```

## ✅ **Solutions Applied**

### **1. Fixed Environment Variable Mismatch**
- **Problem**: `supabaseClient.js` was looking for `VITE_SUPABASE_ANON_KEY`
- **Solution**: Changed to `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (matches .env file)
- **Status**: ✅ FIXED

### **2. Enhanced Error Handling**
- **Added**: Detailed console logging for debugging
- **Added**: Specific error messages for different scenarios
- **Status**: ✅ IMPLEMENTED

### **3. Created Test Users Setup**
- **File**: `create-test-users.sql`
- **Purpose**: Create test accounts for development
- **Status**: ✅ READY TO EXECUTE

---

## 🚀 **Next Steps to Fix Authentication**

### **Step 1: Execute Test Users Script**
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/yybiancphbjcexvtilyd/sql
2. Copy and paste the content of `create-test-users.sql`
3. Execute the script
4. **Result**: Two test users will be created:
   - `test@artisan.com` (password: `password123`)
   - `test@particulier.com` (password: `password123`)

### **Step 2: Test the Login**
1. Restart your development server
2. Try logging in with:
   - Email: `test@artisan.com`
   - Password: `password123`
3. Check the browser console for detailed logs

### **Step 3: Alternative - Create Users via Dashboard**
If the SQL script doesn't work, create users manually:
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add new user"
3. Create users with the above credentials
4. Set their passwords manually

---

## 🔍 **Debugging Information**

### **Enhanced Console Logs**
The authentication now provides detailed logs:
- 📧 Email being tested
- 🌐 Supabase URL being used
- 📊 Full response from Supabase
- ❌ Specific error messages
- ✅ Success confirmations

### **Common Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| Invalid login credentials | User doesn't exist | Create test users |
| Invalid login credentials | Wrong password | Use `password123` |
| Network error | Wrong Supabase URL | Check environment variables |
| RLS error | Missing policies | Run the SQL script |

---

## 🧪 **Testing Checklist**

- [ ] Execute `create-test-users.sql` in Supabase
- [ ] Restart development server
- [ ] Test login with `test@artisan.com` / `password123`
- [ ] Test login with `test@particulier.com` / `password123`
- [ ] Check browser console for detailed logs
- [ ] Verify redirection to correct profile pages

---

## 📋 **Environment Variables Verification**

Your `.env` file should contain:
```env
VITE_SUPABASE_URL=https://yybiancphbjcexvtilyd.supabase.co/
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_P6S7q_W99QYFFXiItriWFg_nn5cFxBO
```

Your `supabaseClient.js` should use:
```javascript
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
```

---

## 🎯 **Expected Results After Fix**

✅ **Successful Authentication**: Users can log in with test credentials  
✅ **Role-Based Redirection**: Artisans → `/profil-artisane`, Particuliers → `/profil-particulier`  
✅ **Better Error Messages**: Clear feedback for users  
✅ **Debugging Info**: Detailed console logs for developers  

---

## 🆘 **If Issues Persist**

1. **Check Supabase Connection**: Verify the URL and API key are correct
2. **Verify User Creation**: Ensure users exist in auth.users table
3. **Check RLS Policies**: Ensure proper permissions are set
4. **Network Issues**: Check if there are CORS or network restrictions
5. **Password Reset**: Use Supabase dashboard to reset test user passwords

---

## 📞 **Support**

If you continue to have issues:
1. Check the browser console for detailed error logs
2. Verify the SQL script executed successfully
3. Ensure environment variables are correctly loaded
4. Test with different browsers or incognito mode

The authentication system should now work properly with the enhanced error handling and test users! 🚀
