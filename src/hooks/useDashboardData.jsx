// src/hooks/useDashboardData.jsx
import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboardData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // ✅ نتحقق من وجود التوكن بدلاً من restaurantId
            const token = localStorage.getItem('token');
            if (!token) {
                setError('الرجاء تسجيل الدخول أولاً');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // ✅ استدعاء الخدمة بدون تمرير restaurantId
                const result = await dashboardService.getSummary();
                setData(result);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // ✅ إزالة restaurantId من هنا لأننا لم نعد نعتمد عليه

    return { data, loading, error };
};