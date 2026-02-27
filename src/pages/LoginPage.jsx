// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/config';

const LoginPage = () => {
    const [slug, setSlug] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    slug: slug,        // 🟢 نرسل slug
                    password: password 
                })
            });

            const data = await response.json();

            if (response.ok) {
                // تخزين البيانات
                localStorage.setItem('token', data.token);
                localStorage.setItem('restaurant_id', data.restaurant_id);
                localStorage.setItem('restaurant_name', data.restaurant_name || slug);
                localStorage.setItem('restaurant_slug', data.slug);
                localStorage.setItem('manager_id', data.manager_id); // إذا احتجته
                
                navigate('/dashboard');
            } else {
                // عرض رسالة الخطأ من الباكند
                setError(data.detail || 'فشل تسجيل الدخول');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('حدث خطأ في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
                    <p className="text-gray-500 mt-2">تسجيل الدخول إلى حسابك</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">اسم المطعم (slug)</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="أدخل slug المطعم (مثال: arizona)"
                            required
                            dir="ltr"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                    >
                        {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>

                {/* للتصحيح فقط - يمكن إزالته لاحقاً */}
                <div className="mt-4 text-xs text-gray-400 text-center">
                    <p>API: {API_BASE}</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;