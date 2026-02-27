// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import HomePage from './pages/HomePage';           // صفحة ترحيب الخدمة
import RestaurantPage from './pages/RestaurantPage'; // صفحة المطعم
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import MenuItemsPage from './pages/MenuItemsPage';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <LanguageProvider>
                <CartProvider>
                    <Routes>
                        {/* 🏠 الصفحة الرئيسية للخدمة (menu.salmansaas.com) */}
                        <Route path="/" element={<HomePage />} />
                        
                        {/* 🍽️ صفحات المطاعم (menu.salmansaas.com/arizona) */}
                        <Route path="/:slug" element={<RestaurantPage />} />
                        
                        {/* 🔐 صفحات الإدارة */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/dashboard/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                        <Route path="/dashboard/items/:categoryId" element={<ProtectedRoute><MenuItemsPage /></ProtectedRoute>} />
                        <Route path="/dashboard/items" element={<ProtectedRoute><MenuItemsPage /></ProtectedRoute>} />
                        
                        {/* 404 - أي مسار غير معروف */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </CartProvider>
            </LanguageProvider>
        </Router>
    );
}

export default App;