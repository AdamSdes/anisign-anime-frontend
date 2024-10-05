import React from 'react';

const InfoItem = ({ label, value }) => (
    <div className="flex bg-[rgba(255,255,255,0.02)] justify-between gap-[20px] rounded-[50px] w-full px-5 py-3 h-[55px] border border-white/5">
        <p className="text-white/60 text-[14px] flex-shrink-0">{label}</p>
        <p className="text-white/80 font-semibold text-[16px] flex-grow text-right whitespace-nowrap overflow-hidden text-overflow: ellipsis">{value}</p>
    </div>
);

export default InfoItem;
