import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import axiosInstance from '../config/axios';
import Notification from '../Components/Notification';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import baseHelper from '../utils/helper';
import logo from '../assets/logo.svg';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import grid from '../assets/grid.svg';
import Navbar from '../Components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const AvailiableNewsletters = () => {
  const { isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
 
  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter h-[110vh]">
      <img
        src={bg1}
        alt=""
        className="lg:block hidden absolute top-0 right-0"
      />
      <img
        src={bg2}
        alt=""
        className="lg:block absolute hidden bottom-0 left-0"
      />
      <Navbar/>
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[35rem] mt-10 m-auto">
        <div className="mb-14">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white text-center">
            Web3mail Newsletter
          </h2>
          <p className="text-sm text-white font-thin text-center">
          Join a community of over 10,000 creators, operators, and investors as they explore the cutting edge of consumer crypto and the future of the internet.
          </p>
        </div>
        <form className="space-y-4">
          <div>
            <div className="relative">
              <div
                className="flex justify-center gap-3 items-center p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white border-2 border-[#3c77fb]">
                <FontAwesomeIcon icon={faSearch} className='text-gray-400' />
                <input
                  type="text"
                  name="Search posts..."
                  placeholder="Search posts..."
                  className="w-full outline-none bg-transparent"
                  required
                />
              </div>
            
            </div>
          </div>
          <div className="flex gap-10 items-center justify-between">
            <button
              className="text-lg font-semibold text-white bg-blue-500 rounded-xl transition-all px-8 py-3 w-full"
            >
              {loading ? <div className="loader"></div> : 'Next'}
            </button>
          </div>
        </form>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default AvailiableNewsletters;
