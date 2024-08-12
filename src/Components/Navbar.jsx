import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.svg';
import grid from '../assets/grid.svg';
// import ConnectButton from './ConnectButton';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const subMenuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const viewSubmenu = () => {
    setSubMenu(!subMenu);
  };

  const handleClickOutside = (event) => {
    if (subMenuRef.current && !subMenuRef.current.contains(event.target)) {
      setSubMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center px-5 lg:px-20 py-5 bg-[#050122] relative">
      <Link to="/">
        <img src={logo} alt="Logo" className="w-32 lg:w-40" />
      </Link>

      <div className="lg:hidden flex items-center">
        <button onClick={toggleMenu} className="text-white text-2xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className={`lg:flex items-center gap-5 ${menuOpen ? 'flex' : 'hidden'} flex-col lg:flex-row absolute lg:border-none border lg:relative top-full left-0 lg:top-auto lg:left-auto w-full lg:w-auto bg-[#050122] lg:bg-transparent p-5 lg:p-0 z-20`}>
        <p onClick={viewSubmenu} className="cursor-pointer text-lg text-gray-400 hover:text-white transition-all">
          Maillist
        </p>

        {subMenu && (
          <div ref={subMenuRef} className="flex flex-col gap-3 items-start mt-2 lg:mt-0 bg-[#161134] p-5 rounded-xl z-20 lg:absolute lg:top-[2rem] lg:right-[21rem] w-[20rem]">
            <Link to="/create-mailist" onClick={() => setMenuOpen(false)} className="text-[#808080] hover:text-[#3C77FB] transition-all">
              Create Maillist
            </Link>
            <Link to="/availiable-newsletters" onClick={() => setMenuOpen(false)} className="text-[#808080] hover:text-[#3C77FB] transition-all">
              Browse Available Maillists
            </Link>
          </div>
        )}
        <Link to="/registered-names" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-[#3C77FB] text-lg font-semibold">
          <img src={grid} alt="Grid" />
          My Names
        </Link>
        <div className="mt-5 lg:mt-0">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
