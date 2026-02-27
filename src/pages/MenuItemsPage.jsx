// src/pages/MenuItemsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/config';

const MenuItemsPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    
    // 🟢 حالات رفع الصورة والتحميل
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        price: '',
        currency: '$',
        image_url: '',
        is_available: true
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [categoryId, token, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // ⚠️ تأكد أن مسار الباك-إند هذا صحيح وموجود تحت /api/admin/
            const catResponse = await fetch(`${API_BASE}/api/admin/categories/${categoryId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (catResponse.ok) {
                const catData = await catResponse.json();
                setCategory(catData);
            }

            // ⚠️ تأكد أن مسار الباك-إند هذا صحيح
            const itemsResponse = await fetch(`${API_BASE}/api/admin/menu-items?category_id=${categoryId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (itemsResponse.ok) {
                const itemsData = await itemsResponse.json();
                // التأكد من بنية البيانات
                if (Array.isArray(itemsData)) {
                    setItems(itemsData);
                } else if (itemsData && Array.isArray(itemsData.data)) {
                    setItems(itemsData.data);
                } else {
                    setItems([]);
                }
            } else {
                console.error("Failed to fetch items:", await itemsResponse.text());
                setItems([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            alert('فشل في تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let finalImageUrl = formData.image_url;

            // 🟢 1. رفع الصورة إذا تم اختيار صورة جديدة
            if (imageFile) {
                const fileData = new FormData();
                fileData.append('file', imageFile);
                
                const uploadRes = await fetch(`${API_BASE}/api/admin/upload-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: fileData
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalImageUrl = uploadData.image_url;
                } else {
                    const errData = await uploadRes.json();
                    alert(`فشل رفع الصورة: ${errData.detail || 'خطأ غير معروف'}`);
                    setIsSubmitting(false);
                    return;
                }
            }

            // 🟢 2. حفظ بيانات الصنف
            const url = editingItem 
                ? `${API_BASE}/api/admin/menu-items/${editingItem.id}`
                : `${API_BASE}/api/admin/menu-items`;
            
            const method = editingItem ? 'PUT' : 'POST';
            
            const bodyData = {
                name_ar: formData.name_ar,
                name_en: formData.name_en,
                description_ar: formData.description_ar,
                description_en: formData.description_en,
                price: parseFloat(formData.price),
                currency: formData.currency,
                image_url: finalImageUrl,
                is_available: formData.is_available,
                category_id: categoryId
                // ✅ تم إزالة restaurant_id لأنه يُستخرج من الـ Token في الباك-إند
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                setShowModal(false);
                setEditingItem(null);
                setFormData({
                    name_ar: '', name_en: '', description_ar: '', description_en: '',
                    price: '', currency: '$', image_url: '', is_available: true
                });
                setImageFile(null);
                fetchData();
            } else {
                const errorData = await response.json();
                alert(`خطأ: ${errorData.detail || 'فشل في الحفظ'}`);
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الصنف؟')) return;
        
        try {
            const response = await fetch(`${API_BASE}/api/admin/menu-items/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                fetchData();
            } else {
                alert('فشل الحذف');
            }
        } catch (err) {
            alert('حدث خطأ في الاتصال');
        }
    };

    const toggleAvailability = async (item) => {
        try {
            const response = await fetch(`${API_BASE}/api/admin/menu-items/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    // نرسل البيانات الضرورية للتحديث، أو فقط الحقل المتغير حسب ما يدعمه الباك-إند
                    is_available: !item.is_available
                })
            });
            
            if (response.ok) {
                fetchData();
            } else {
                 alert('فشل في تغيير الحالة');
            }
        } catch (err) {
            alert('فشل في الاتصال لتغيير الحالة');
        }
    };

    if (loading) return <div className="p-8 text-center min-h-screen flex items-center justify-center text-xl">جاري التحميل...</div>;

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl">
            {/* Header */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">إدارة الأصناف</h1>
                        {category && (
                            <p className="text-gray-600 mt-1 font-medium">الفئة: {category.name_ar}</p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/dashboard/categories')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            العودة للفئات
                        </button>
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setFormData({
                                    name_ar: '', name_en: '', description_ar: '', description_en: '',
                                    price: '', currency: '$', image_url: '', is_available: true
                                });
                                setImageFile(null);
                                setShowModal(true);
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            + إضافة صنف جديد
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {items.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 mb-4 text-lg">لا توجد أصناف في هذه الفئة</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            أضف أول صنف
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                                {item.image_url ? (
                                    <img 
                                        src={item.image_url} 
                                        alt={item.name_ar}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                                        بدون صورة
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold">{item.name_ar}</h3>
                                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                                            item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {item.is_available ? 'متوفر' : 'غير متوفر'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">{item.name_en}</p>
                                    {item.description_ar && (
                                        <p className="text-gray-500 text-sm mb-2">{item.description_ar}</p>
                                    )}
                                    <p className="text-2xl font-bold text-orange-600 mb-4">
                                        {item.price} {item.currency}
                                    </p>
                                    <div className="flex justify-between items-center border-t pt-4 mt-2">
                                        <button
                                            onClick={() => toggleAvailability(item)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition ${
                                                item.is_available 
                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {item.is_available ? 'تعطيل' : 'تفعيل'}
                                        </button>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setFormData({
                                                        name_ar: item.name_ar,
                                                        name_en: item.name_en,
                                                        description_ar: item.description_ar || '',
                                                        description_en: item.description_en || '',
                                                        price: item.price,
                                                        currency: item.currency || '$',
                                                        image_url: item.image_url || '',
                                                        is_available: item.is_available
                                                    });
                                                    setImageFile(null);
                                                    setShowModal(true);
                                                }}
                                                className="text-orange-600 hover:text-orange-800 font-semibold"
                                            >
                                                تعديل
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-800 font-semibold"
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                            {editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2 font-medium">الاسم (عربي) *</label>
                                    <input
                                        type="text"
                                        value={formData.name_ar}
                                        onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2 font-medium">الاسم (إنجليزي) *</label>
                                    <input
                                        type="text"
                                        value={formData.name_en}
                                        onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-medium">الوصف (عربي)</label>
                                <textarea
                                    value={formData.description_ar}
                                    onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    rows="2"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-medium">الوصف (إنجليزي)</label>
                                <textarea
                                    value={formData.description_en}
                                    onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    rows="2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2 font-medium">السعر *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2 font-medium">العملة</label>
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="$">دولار ($)</option>
                                        <option value="ل.ل">ليرة لبنانية (ل.ل)</option>
                                        <option value="€">يورو (€)</option>
                                    </select>
                                </div>
                            </div>

                            {/* 🟢 حقل رفع الصورة */}
                            <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-gray-700 mb-2 font-medium">صورة الصنف</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="w-full p-2 border bg-white border-gray-300 rounded focus:outline-none focus:border-orange-500"
                                />
                                {formData.image_url && !imageFile && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500 mb-1">الصورة الحالية:</p>
                                        <img src={formData.image_url} alt="Current item" className="h-24 rounded object-cover border" />
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_available}
                                        onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                                        className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                                    />
                                    <span className="ml-2 mr-2 text-gray-700 font-medium">متوفر للطلب</span>
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 text-white py-3 rounded-lg font-bold transition duration-200 ${
                                        isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                                    }`}
                                >
                                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ الصنف'}
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition duration-200"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuItemsPage;