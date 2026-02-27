import React, { useState } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import { getMenuSlug } from '../utils/config';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

// استيراد المكونات المنفصلة التي قمنا بإنشائها
import Header from '../components/layout/Header';
import CategoriesBar from '../components/menu/CategoriesBar';
import MenuItemCard from '../components/menu/MenuItemCard';
import FloatingCart from '../components/layout/FloatingCart';

const RestaurantPage = () => {  // 🔵 تم التعديل هنا
    // 1. استخراج السلوغ وجلب البيانات
    const slug = getMenuSlug() || 'arizona'; 
    const { data, loading, error } = useMenuData(slug);
    
    // 2. استدعاء أدوات اللغة والسلة
    const { lang, t, toggleLanguage } = useLanguage();
    const { addToCart } = useCart();
    
    // 3. حالة (State) لتتبع الفئة النشطة حالياً
    const [activeCategory, setActiveCategory] = useState(null);

    // حالات التحميل والخطأ
    if (loading) {
        return <div className="flex justify-center items-center h-screen font-bold text-xl text-orange-500">{t('loading')}</div>;
    }
    
    if (error || !data) {
        return (
            <div className="flex items-center justify-center h-screen text-center p-4">
                <div>
                    <h2 className="text-xl font-bold">{t('restaurantNotFound')}</h2>
                    <p className="text-gray-500 mt-2">{t('checkLink')}</p>
                </div>
            </div>
        );
    }

    const { restaurant, categories, items } = data;

    // دالة التمرير السلس عند الضغط على فئة في الشريط العلوي
    const handleCategoryClick = (catId) => {
        setActiveCategory(catId);
        const el = document.getElementById(`cat-${catId}`);
        if (el) {
            // نخصم 120 بكسل لكي لا يغطي الشريط العلوي على عنوان الفئة
            const y = el.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-32 font-sans">
            {/* زر اللغة العائم */}
            <button 
                onClick={toggleLanguage} 
                className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur shadow-md px-4 py-2 rounded-full font-bold text-sm border border-gray-100 text-gray-700"
            >
                <i className="fas fa-globe me-1 text-orange-500"></i> {lang === 'ar' ? 'English' : 'عربي'}
            </button>

            {/* الهيدر (صورة الغلاف، اللوجو، الاسم) */}
            <Header restaurant={restaurant} lang={lang} t={t} />

            {/* شريط الفئات القابل للتمرير */}
            <div className="mt-6">
                <CategoriesBar 
                    categories={categories} 
                    lang={lang} 
                    // إذا لم يتم اختيار فئة، اجعل الفئة الأولى هي النشطة افتراضياً
                    activeCategory={activeCategory || (categories.length > 0 ? categories[0].id : null)} 
                    onCategoryClick={handleCategoryClick} 
                />
            </div>

            {/* قائمة المنتجات مقسمة حسب الفئات */}
            <main className="p-4 space-y-8 mt-4">
                {categories.map(cat => {
                    const catItems = items.filter(i => i.category_id === cat.id);
                    if (catItems.length === 0) return null;

                    return (
                        <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-32">
                            <h3 className="font-extrabold text-2xl mb-4 px-1 text-gray-800 flex items-center gap-2">
                                {lang === 'ar' ? cat.name_ar : cat.name_en}
                            </h3>
                            
                            {/* شبكة المنتجات (عمود واحد للموبايل، عمودين للشاشات الأكبر) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {catItems.map(item => (
                                    <MenuItemCard 
                                        key={item.id} 
                                        item={item} 
                                        lang={lang} 
                                        onAddToCart={(selectedItem) => {
                                            addToCart({
                                                id: selectedItem.id, 
                                                name: lang === 'ar' ? selectedItem.name_ar : selectedItem.name_en, 
                                                price: selectedItem.price, 
                                                currency: selectedItem.currency 
                                            });
                                        }} 
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </main>

            {/* شريط السلة العائم في الأسفل */}
            <FloatingCart restaurantPhone={restaurant?.phone} />
        </div>
    );
};

export default RestaurantPage;  // 🔵 تم التعديل هنا