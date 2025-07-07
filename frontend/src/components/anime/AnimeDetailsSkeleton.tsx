import React from 'react';

/**
 * Скелетный компонент для AnimeDetails, показывается во время загрузки
 */
const AnimeDetailsSkeleton: React.FC = () => {
  return (
    <section className='relative'>
      <div className='container px-5 flex flex-col lg:flex-row gap-8 relative'>
        {/* Left Column - Poster Skeleton */}
        <article className='flex flex-col gap-6 lg:top-24 h-fit'>
          <div className='w-[315px] h-[454px] rounded-[14px] bg-white/[0.03] animate-pulse' />
          {/* Кнопка смотреть скелет */}
          <div className='w-full h-[52px] py-4 rounded-xl bg-white/[0.03] animate-pulse' />
        </article>

        {/* Center Column - Main Info Skeleton */}
        <article className='flex w-full flex-col gap-8'>
          {/* Next Episode Block Skeleton (conditionally shown) */}
          <div className='flex items-center justify-between p-5 bg-white/[0.02] rounded-xl animate-pulse'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-white/[0.05]' />
              <div className='space-y-1'>
                <div className='w-32 h-5 bg-white/[0.05] rounded-full' />
                <div className='w-40 h-3 bg-white/[0.03] rounded-full' />
              </div>
            </div>
            <div className='px-3 py-2 w-32 h-10 rounded-lg bg-white/[0.05]' />
          </div>

          {/* Title Skeleton */}
          <header className='flex justify-between items-start gap-4'>
            <div className='flex flex-col gap-2 w-4/5'>
              <div className='w-full h-9 bg-white/[0.05] rounded-md' />
              <div className='w-2/3 h-4 bg-white/[0.03] rounded-md' />
            </div>
            <div className='w-16 h-10 rounded-xl bg-white/[0.05]' />
          </header>

          {/* Genres Skeleton */}
          <div className='flex gap-2 flex-wrap'>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className='w-24 h-9 px-4 py-2 bg-white/[0.02] rounded-xl animate-pulse'
              />
            ))}
          </div>

          {/* Divider Skeleton */}
          <div className='w-full h-[1px] bg-white/5' />

          {/* Description Skeleton */}
          <div className='flex flex-col gap-3'>
            <div className='w-full h-4 bg-white/[0.03] rounded-md' />
            <div className='w-full h-4 bg-white/[0.03] rounded-md' />
            <div className='w-full h-4 bg-white/[0.03] rounded-md' />
            <div className='w-3/4 h-4 bg-white/[0.03] rounded-md' />
            <div className='w-5/6 h-4 bg-white/[0.03] rounded-md' />
            <div className='w-4/5 h-4 bg-white/[0.03] rounded-md' />
          </div>
        </article>

        {/* Vertical Divider Line */}
        <div className='hidden lg:block w-[1px] bg-white/5' />

        {/* Right Column - Additional Info Skeleton */}
        <aside className='hidden lg:block min-w-[320px] space-y-4'>
          {/* Type Skeleton */}
          <div className='bg-white/[0.02] rounded-xl p-5'>
            <div className='flex justify-between items-center'>
              <div className='w-12 h-4 bg-white/[0.05] rounded-md' />
              <div className='w-20 h-4 bg-white/[0.05] rounded-md' />
            </div>
          </div>

          {/* Episodes Skeleton */}
          <div className='bg-white/[0.02] rounded-xl p-5'>
            <div className='flex justify-between items-center'>
              <div className='w-16 h-4 bg-white/[0.05] rounded-md' />
              <div className='w-8 h-4 bg-white/[0.05] rounded-md' />
            </div>
          </div>

          {/* Duration Skeleton */}
          <div className='bg-white/[0.02] rounded-xl p-5'>
            <div className='flex justify-between items-center'>
              <div className='w-24 h-4 bg-white/[0.05] rounded-md' />
              <div className='w-16 h-4 bg-white/[0.05] rounded-md' />
            </div>
          </div>

          {/* Season Skeleton */}
          <div className='bg-white/[0.02] rounded-xl p-5'>
            <div className='flex justify-between items-center'>
              <div className='w-12 h-4 bg-white/[0.05] rounded-md' />
              <div className='w-24 h-4 bg-white/[0.05] rounded-md' />
            </div>
          </div>

          {/* Dates Skeleton */}
          <div className='bg-white/[0.02] rounded-xl p-5 space-y-3'>
            <div className='flex justify-between items-center'>
              <div className='w-28 h-4 bg-white/[0.05] rounded-md' />
              <div className='w-28 h-4 bg-white/[0.05] rounded-md' />
            </div>
            <div className='flex justify-between items-center'>
              <div className='w-32 h-4 bg-white/[0.05] rounded-md' />
              <div className='w-28 h-4 bg-white/[0.05] rounded-md' />
            </div>
          </div>

          {/* Status Skeleton */}
          <div className='bg-white/[0.02] rounded-xl p-5'>
            <div className='flex justify-between items-center'>
              <div className='w-16 h-4 bg-white/[0.05] rounded-md' />
              <div className='w-20 h-4 bg-white/[0.05] rounded-md' />
            </div>
          </div>

          {/* Ratings Skeleton */}
          <div className='bg-white/[0.02] rounded-xl p-5'>
            <div className='flex justify-between items-center'>
              <div className='w-20 h-4 bg-white/[0.05] rounded-md' />
              <div className='w-36 h-4 bg-white/[0.05] rounded-md' />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AnimeDetailsSkeleton;
