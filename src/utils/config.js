// src/utils/config.js

// تحديد رابط الباك إند بناءً على البيئة
export const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://menu1.salmansaas.com";

// دالة لمعرفة بيئة العمل
export const getAppEnvironment = () => {
    const hostname = window.location.hostname;
    if (hostname.startsWith('admin.')) {
        return 'ADMIN';
    }
    return 'MENU';
};

// دالة استخراج Slug المنيو
export const getMenuSlug = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'menu' && parts[0] !== 'admin') {
        return parts[0]; 
    }
    
    const params = new URLSearchParams(window.location.search);
    return params.get('slug'); 
};