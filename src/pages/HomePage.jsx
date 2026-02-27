// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        ارتقِ بأعمالك للمستقبل
                    </h1>
                    <p className="text-2xl text-orange-600 font-semibold mb-8">
                        بأنظمة ذكية وسريعة
                    </p>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        أنظمة سحابية متطورة لإدارة الحجوزات والقوائم الإلكترونية، 
                        صممت لتعكس فخامة علامتك التجارية.
                    </p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl mb-4">✓</div>
                        <h3 className="text-xl font-bold mb-2">نظام حجز ذكي</h3>
                        <p className="text-gray-600">متكامل عبر واتساب لإدارة الحجوزات بسهولة</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl mb-4">✓</div>
                        <h3 className="text-xl font-bold mb-2">إدارة المواعيد</h3>
                        <p className="text-gray-600">تابع العملاء والمواعيد بدقة وسرعة فائقة</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl mb-4">✓</div>
                        <h3 className="text-xl font-bold mb-2">وفر الوقت والمال</h3>
                        <p className="text-gray-600">الوقت هو المال، وأنظمتنا توفر لك كلاهما</p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        ابدأ رقمنة عملك اليوم
                    </h2>
                    <p className="text-gray-600 mb-8">
                        فريقنا جاهز لمساعدتك في اختيار النظام الأنسب لنمو مشروعك. 
                        اختر الطريقة المفضلة للتواصل:
                    </p>
                    <div className="space-y-4">
                        <a 
                            href="mailto:support@salmansaas.com"
                            className="block bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition"
                        >
                            📧 support@salmansaas.com
                        </a>
                        <button
                            onClick={() => navigate('/restaurant/demo')}
                            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition"
                        >
                            👀 معاينة تجريبية (مطعم ديمو)
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500">
                    <p>الدعم الرسمي: support@salmansaas.com</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;