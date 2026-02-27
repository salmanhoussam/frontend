// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';

const DashboardPage = () => {
    const navigate = useNavigate();
    // restaurantId ما زال موجوداً للتحقق من تسجيل الدخول (ولا مشكلة في ذلك)
    const restaurantId = localStorage.getItem('restaurant_id');
    const restaurantName = localStorage.getItem('restaurant_name');

    // ✅ التعديل هنا: إزالة تمرير restaurantId
    const { data, loading, error } = useDashboardData();

    useEffect(() => {
        // التحقق من وجود التوكن
        const token = localStorage.getItem('token');
        if (!token || !restaurantId) {
            navigate('/login');
        }
    }, [navigate, restaurantId]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('restaurant_id');
        localStorage.removeItem('restaurant_name');
        localStorage.removeItem('restaurant_slug');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">جاري التحميل...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">خطأ: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl"> {/* أضفت dir="rtl" ليتوافق مع اللغة العربية */}
            {/* Header */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold text-gray-800">
                            مرحباً، {restaurantName}
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {data ? (
                    <div className="space-y-6">
                        {/* أزرار التنقل السريع */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div 
                                onClick={() => navigate('/dashboard/categories')}
                                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition border-2 border-transparent hover:border-orange-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl">📑</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">إدارة الفئات</h3>
                                        <p className="text-gray-600">إضافة وتعديل وحذف فئات المطعم</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div 
                                onClick={() => navigate('/dashboard/items')}
                                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition border-2 border-transparent hover:border-orange-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl">🍽️</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">إدارة الأصناف</h3>
                                        <p className="text-gray-600">إضافة وتعديل وحذف أصناف القائمة</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* بطاقات الإحصائيات */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
                                <h3 className="text-gray-500 text-sm font-semibold mb-1">عدد الأصناف</h3>
                                <p className="text-3xl font-bold text-gray-800">{data.stats?.items_count || 0}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
                                <h3 className="text-gray-500 text-sm font-semibold mb-1">عدد الطلبات</h3>
                                <p className="text-3xl font-bold text-gray-800">{data.stats?.orders_count || 0}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
                                <h3 className="text-gray-500 text-sm font-semibold mb-1">حالة المطعم</h3>
                                <p className="text-3xl font-bold text-green-600">
                                    {data.restaurant?.is_active ? 'نشط' : 'غير نشط'}
                                </p>
                            </div>
                        </div>

                        {/* آخر الطلبات */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">آخر الطلبات</h2>
                            </div>
                            <div className="p-6">
                                {!data.recent_orders || data.recent_orders.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">لا توجد طلبات بعد</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-right">
                                            <thead>
                                                <tr className="border-b-2 border-gray-200 text-gray-600">
                                                    <th className="py-3 px-4">العميل</th>
                                                    <th className="py-3 px-4">المبلغ</th>
                                                    <th className="py-3 px-4">الحالة</th>
                                                    <th className="py-3 px-4">التاريخ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.recent_orders.map(order => (
                                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                                        <td className="py-3 px-4 font-medium">{order.customer_name}</td>
                                                        <td className="py-3 px-4 font-bold text-gray-700">{order.total_price} {order.currency || '$'}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {order.status === 'completed' ? 'مكتمل' : 
                                                                 order.status === 'pending' ? 'قيد الانتظار' : order.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString('ar-EG')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 text-lg">لا توجد بيانات لعرضها</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;