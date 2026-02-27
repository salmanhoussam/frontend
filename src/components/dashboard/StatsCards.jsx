// src/components/dashboard/StatsCards.jsx
import React from 'react';

const StatsCards = ({ stats }) => {
    const cards = [
        { 
            title: 'عدد الأصناف', 
            value: stats?.items_count || 0, 
            icon: '🍽️',
            color: 'orange' 
        },
        { 
            title: 'عدد الطلبات', 
            value: stats?.orders_count || 0, 
            icon: '📦',
            color: 'blue' 
        },
        { 
            title: 'المبيعات اليومية', 
            value: stats?.daily_sales ? `${stats.daily_sales} $` : '0 $', 
            icon: '💰',
            color: 'green' 
        },
        { 
            title: 'عدد الفئات', 
            value: stats?.categories_count || 0, 
            icon: '📑',
            color: 'purple' 
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div key={index} className={`bg-white rounded-lg shadow p-6 border-r-4 border-${card.color}-500`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">{card.title}</p>
                            <p className="text-2xl font-bold mt-1">{card.value}</p>
                        </div>
                        <span className="text-3xl opacity-50">{card.icon}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;