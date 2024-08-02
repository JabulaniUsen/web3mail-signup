import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from '../assets/logo.svg';
import grid from '../assets/grid.svg';

const Navbar = () => {
  const [subMenu, setSubmenu] = useState(false);
  const subMenuRef = useRef(null);

  const viewSubmenu = () => {
    setSubmenu(!subMenu);
  };

  const handleClickOutside = (event) => {
    if (subMenuRef.current && !subMenuRef.current.contains(event.target)) {
      setSubmenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div className='flex justify-between lg:mb-20 mb-10'>
      <Link to='/'>
        <img src={logo} alt='Logo' />
      </Link>
      
      <div className="z-20 transition-all flex items-center gap-5 relative">
        <Link to='/create-mailist'>
          <p className='text-lg transition-all text-gray-400 hover:text-white'>
            Create Mailist
          </p>
        </Link>
        <p onClick={viewSubmenu} className="cursor-pointer text-lg transition-all text-gray-400 hover:text-white">
          Newsletter
        </p>
        {subMenu && 
          <div ref={subMenuRef} className="p-5 rounded-xl bg-[#161134] flex flex-col gap-3 items-start absolute top-10 right-[9rem]">
            <p>
              <Link to='/availiable-newsletters'>
                <p className='text-[#808080] hover:text-[#3C77FB] transition-all'>Browse Available Newsletter</p>
              </Link>
            </p>
            <p>
              <Link>
                <p className='text-[#808080] hover:text-[#3C77FB] transition-all'>View Subscribed Newsletter</p>
              </Link>
            </p>
          </div> 
        }
        <Link to='/registered-names'>
          <div className="flex item-center gap-1 cursor-pointer">
            <img src={grid} alt="Grid" />
            <p className='text-[#3C77FB] text-lg font-semibold'>My Names</p>
          </div>
        </Link>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
