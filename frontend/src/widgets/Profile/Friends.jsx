const Frineds = () => {
  const friends = [
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
    'ADAMSSSSSSSSS',
  ];
  return (
    <div className="flex flex-col gap-[30px]">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-[19px] font-semibold">Друзья</h1>

        <div className="flex items-center justify-center gap-[15px]">
          <div className="py-[5px] px-[13px] text-[12px] font-medium rounded-full bg-[#FFFFFF0D]">
            {friends.length}
          </div>
          <div className="py-[5px] px-[13px] text-[12px] font-medium rounded-full bg-[#FFFFFF0D]">
            Добавить
          </div>
        </div>
      </div>

      <div className="flex gap-[15px] flex-wrap">
        {friends.map((name, index) => (
          <div key={index} className="w-[62px] flex flex-col gap-[12px]">
            <div className="relative">
              <div className="w-[62px] h-[62px] rounded-[10px] bg-[url('/auth-bg.png')] bg-cover" />
              <div className="absolute bottom-[-8px] left-0 right-0 mx-auto flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#060606]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#BFF6F9]" />
              </div>
            </div>

            <h1 className="text-[#FAFAFA9E] text-[10px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frineds;
