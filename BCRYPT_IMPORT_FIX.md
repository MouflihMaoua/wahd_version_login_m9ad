# 🔧 **bcrypt Import Fix - QUICK RESOLUTION**

## ❌ **Current Issue**
```
Failed to resolve import "bcryptjs" from "src/core/utils/passwordUtils.js"
```

## ✅ **Root Cause**
Vite has issues with dynamic bcrypt imports in some configurations. The solution is to use a different approach.

---

## 🚀 **Two Solutions Available**

### **Solution 1: Use Native Web Crypto API (Recommended)**
Replace bcrypt with Web Crypto API for better browser compatibility.

### **Solution 2: Fix bcrypt Import (Quick Fix)**
Use a different import pattern that Vite handles better.

---

## 🔧 **Quick Fix Implementation**

### **Replace passwordUtils.js content:**

```javascript
// Solution 1: Use Web Crypto API
export const hashPassword = async (password) => {
  try {
    if (!password || password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    // Generate salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltBase64 = btoa(String.fromCharCode(...salt));
    
    // Hash password
    const encoder = new TextEncoder();
    const data = encoder.encode(password + saltBase64);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    
    return `${saltBase64}:${hashBase64}`;
  } catch (error) {
    console.error('💥 Error hashing password:', error);
    throw new Error('Erreur lors du hachage du mot de passe');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const [saltBase64, storedHash] = hashedPassword.split(':');
    const encoder = new TextEncoder();
    const data = encoder.encode(password + saltBase64);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    
    return hashBase64 === storedHash;
  } catch (error) {
    console.error('💥 Error comparing password:', error);
    throw new Error('Erreur lors de la comparaison du mot de passe');
  }
};
```

### **Solution 2: Vite-compatible bcrypt import**
```javascript
// Alternative approach for bcrypt
export const hashPassword = async (password) => {
  try {
    // Use require instead of import for better Vite compatibility
    const bcrypt = require('bcryptjs');
    
    if (!password || password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    return hashedPassword;
  } catch (error) {
    console.error('💥 Error hashing password:', error);
    throw new Error('Erreur lors du hachage du mot de passe');
  }
};
```

---

## 🎯 **Recommended Action**

### **Use Web Crypto API (Solution 1)**
1. **Better browser compatibility**
2. **No additional dependencies needed**
3. **Faster performance**
4. **More secure for web environment**

### **Replace the content in passwordUtils.js** with the Web Crypto version above.

---

## 🚀 **Test the Fix**

1. Save the passwordUtils.js changes
2. Restart development server
3. Test registration at `/inscription-artisan`
4. Check console for successful hashing

---

## 📋 **If Issues Persist**

### **Alternative: Remove bcrypt temporarily**
```javascript
// Temporary solution - remove bcrypt usage
export const hashPassword = async (password) => {
  // Simple validation for now
  if (!password || password.length < 8) {
    throw new Error('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  // Return password with basic encoding (temporary)
  return btoa(password);
};

export const comparePassword = async (password, hashedPassword) => {
  // Simple comparison (temporary)
  return password === hashedPassword;
};
```

---

## 🔍 **Next Steps**

1. **Choose Solution**: Web Crypto API (recommended) or temporary fix
2. **Update passwordUtils.js** with chosen solution
3. **Test registration flow**
4. **Verify authentication works**
5. **Implement full bcrypt later** if needed

The Web Crypto API solution is recommended for production use! 🚀
