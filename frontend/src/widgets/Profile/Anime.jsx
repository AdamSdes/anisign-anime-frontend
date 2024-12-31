const Anime = () => {
  const tags = [
    'Cмотрю',
    'Просмотрено',
    'Запланировано',
    'Брошено',
    'Отложено',
  ];

  const animeList = [
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
  ];

  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className="text-[19px] font-semibold">Аниме</h1>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="flex gap-3 items-center p-3 border rounded-[50px] bg-[rgba(255,255,255,0.02)]"
          >
            <div className="w-[8px] h-[8px] bg-[#BFF6F9] rounded-[100px]"></div>
            <p>{tag}</p>
            <span>1</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {animeList.map((item, index) => (
          <div key={index} className="flex flex-col gap-3">
            <img src="/anime1.png" className='object-cover' alt="" />
            <div className="flex flex-col gap-1">
              <h1 className="text-sm text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
              </h1>

              <div className="flex items-center gap-2">
                <h3 className="text-white/40 text-sm font-medium">
                  {item.year}
                </h3>
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <h3 className="text-white/40 text-sm font-medium">
                  {item.gener}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Anime;
