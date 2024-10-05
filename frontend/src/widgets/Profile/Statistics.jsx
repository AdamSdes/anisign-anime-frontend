import React from 'react';

const Statistics = () => {
    return (
        <div className="container mx-auto py-8 px-4">
            <h2 className="text-xl font-bold text-white mb-4">Статистика</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[rgba(255,255,255,0.02)] border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <svg width="24" height="24" fill="currentColor" className="text-purple-400">
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm2 14h-4a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2zm1-4h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zm2-4h-8a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2z"></path>
                        </svg>
                        <span className="text-white text-lg">Активность</span>
                    </div>
                    {/* Столбики активности */}
                    <div className="flex space-x-2">
                        {[3, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0].map((val, index) => (
                            <div
                                key={index}
                                className="w-2 bg-purple-500 rounded"
                                style={{
                                    height: `${val * 20}px`, // Высота столбиков
                                    opacity: val === 0 ? 0.3 : 1, // Полупрозрачные, если активность 0
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.02)] border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <svg width="24" height="24" fill="currentColor" className="text-purple-400">
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm2 14h-4a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2zm1-4h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zm2-4h-8a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2z"></path>
                        </svg>
                        <span className="text-white text-lg">Время просмотра</span>
                    </div>
                    <p className="text-white mb-2">6 месяцев 5 дней</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-white text-sm">4465 часов</span>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
