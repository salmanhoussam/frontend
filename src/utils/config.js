// src/utils/config.js

/// 🟢 تحديد رابط الباك إند بناءً على البيئة
export const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"                    // ✅ تم تغيير 127.0.0.1 إلى localhost لمنع مشاكل CORS
    : 'https://admin.salmansaas.com';            // ⚠️ ملاحظة: تأكد أن الباك-إند مرفوع فعلاً على هذا النطاق، عادة يكون api.salmansaas.com
// 🟢 دالة لمعرفة بيئة العمل
export const getAppEnvironment = () => {
    const hostname = window.location.hostname;
    if (hostname.startsWith('admin.')) {
        return 'ADMIN';     // لوحة الإدارة
    } else if (hostname.startsWith('resto.')) {
        return 'RESTAURANT'; // 🟢 نسخة المطاعم - هون بتغير الاسم بعدين
    }
    return 'UNKNOWN';
};

// 🟢 دالة استخراج Slug المنيو - معدلة للـ subdomain
export const getMenuSlug = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // 1. التحقق من مسار URL أولاً (للحالات اللي فيها /arizona)
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1] && 
        pathParts[1] !== 'dashboard' && 
        pathParts[1] !== 'login' && 
        !pathParts[1].startsWith('?')) {
        return pathParts[1];  // من الرابط: resto.salmansaas.com/arizona
    }
    
    // 2. التحقق من subdomain (للحالات اللي فيها arizona.resto.salmansaas.com)
    if (parts.length > 2 && 
        parts[0] !== 'www' && 
        parts[0] !== 'admin' && 
        parts[0] !== 'resto') {
        return parts[0]; // arizona.resto.salmansaas.com
    }
    
    // 3. آخر خيار: من معاملات URL
    const params = new URLSearchParams(window.location.search);
    return params.get('slug'); // resto.salmansaas.com/?slug=arizona
};

// 🟢 دالة الحصول على رابط المطعم الكامل
export const getRestaurantUrl = (slug) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${slug}`;
};

// 🟢 دالة التحقق مما إذا كان المستخدم في صفحة المطعم
export const isRestaurantPage = () => {
    const slug = getMenuSlug();
    return !!slug && 
           !window.location.pathname.startsWith('/dashboard') && 
           !window.location.pathname.startsWith('/login');
};

// 🟢 دالة الحصول على عنوان الموقع حسب البيئة
export const getSiteUrl = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
        return 'http://localhost:5173';
    }
    return `https://${hostname}`;
};