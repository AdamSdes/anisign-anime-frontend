import { Button } from '@/components/ui/button';

const Report = () => {
  return (
    <header className='bg-[rgba(255,255,255,0.02)] text-white py-4 h-[80px] flex items-center'>
      <div className='container px-4 mx-auto flex justify-between items-center'>
        <p className='text-[14px] opacity-80'>
          Сайт находится в бета-версии. Если вы нашли баг, пожалуйста, сообщите нам об этом.
        </p>
        <Button className='py-5 rounded-xl bg-white/2 text-white/60 hover:bg-white/7 hover:text-white/60'>
          Сообщить
        </Button>
      </div>
    </header>
  );
};

export default Report;
