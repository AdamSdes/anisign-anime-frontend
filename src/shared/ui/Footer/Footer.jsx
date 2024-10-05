import Link from 'next/link';

const Footer = () => {
  return (
      <footer className="bg-none footer-border py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <Link href='/'
                className="flex gap-3 md:gap-5 items-center opacity-100 hover:opacity-70 transition-opacity duration-300 mb-3 md:mb-0">
            <img src="logo.png" alt="Anisign Logo" className="w-8 h-8 md:w-[30px] md:h-[30px]"/>
            <p className='text-white text-sm md:text-[14px]'>
              Anisign<span className="text-gray-400 text-xs md:text-[12px]">.com</span>
            </p>
          </Link>
          <div className="text-white flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <Link href='mailto:support@anisign.com'
                  className="text-[#CCBAE4] opacity-100 hover:opacity-70 transition-opacity duration-300 text-sm md:text-base">
              support@anisign.com
            </Link>
            <p className="text-[#787878] text-sm md:text-base">© 2024 Anisign</p>
          </div>
        </div>
      </footer>
  );
}

export default Footer;
