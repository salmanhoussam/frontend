// src/services/dashboardService.js
import { API_BASE } from '../utils/config';

export const dashboardService = {
    // جلب بيانات الداشبورد (تم إزالة parameter restaurantId لأننا لم نعد نحتاجه)
    getSummary: async () => {
        const token = localStorage.getItem('token');
        
        // ✅ تم إزالة restaurantId من الرابط
        const response = await fetch(`${API_BASE}/api/dashboard/summary`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403 || response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

        return response.json();
    },

    // جلب آخر الطلبات
    getRecentOrders: async (restaurantId, limit = 10) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/orders/recent/${restaurantId}?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    // تغيير حالة المطعم
    toggleRestaurantStatus: async (restaurantId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/restaurants/${restaurantId}/toggle-status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }
};