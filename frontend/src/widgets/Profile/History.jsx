const History = () => {
  const history = [
    {
      title: 'Test',
      episodes: '24/24',
      time: '1 day out',
    },
    {
      title: 'Test',
      episodes: '24/24',
      time: '1 day out',
    },
    {
      title: 'Test',
      episodes: '24/24',
      time: '1 day out',
    },
    {
      title: 'Test',
      episodes: '24/24',
      time: '1 day out',
    },
  ];

  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className="text-[19px] font-semibold">История</h1>

      <div className="flex flex-col gap-[10px]">
        {history.map((item, index) => (
          <div key={index} className="flex items-center gap-[12px]">
            <div className="w-[48px] h-[68px] bg-[url('/anime1.png')] bg-cover" />

            <div className="flex flex-col gap-[5px]">
              <h1 className="text-[14px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
              </h1>
              <h2 className="text-[12px] text-[#A1A1AA]">
                {item.episodes} эпизодов
              </h2>
              <h2 className="text-[12px] text-[#A1A1AA] opacity-60">
                {item.time}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
