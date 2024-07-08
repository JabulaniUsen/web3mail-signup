import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../config/axios';
import Notification from '../Components/Notification';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import baseHelper from '../utils/helper';
import { useAccount } from 'wagmi';
import logo from '../assets/logo.svg';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';

const PickUsername = () => {
  const [username, setUsername] = useState('');
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { isConnected } = useAccount();
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setUsernameAvailability(null);
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (username) {
      checkUsernameAvailability(username);
    } else {
      setUsernameAvailability(null);
      setSuggestions([]);
    }
  }, [username]);

  const handleChange = (e) => {
    const { value } = e.target;
    setUsername(value);
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axiosInstance.get(`/usernameAvailability/${username}`);
      setUsernameAvailability(response.data.isTaken ? 'Taken' : 'Available');
      if (!response.data.isTaken) {
        setSuggestions(generateSuggestions(username));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameAvailability(null);
      setSuggestions([]);
    }
  };

  const generateSuggestions = (base) => {
    const suggestions = [];
    for (let i = 1; i <= 4; i++) {
      suggestions.push(`${base}${i}`);
    }
    return suggestions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if username is available
    if (usernameAvailability === 'Taken') {
      setNotification({ message: 'Username is already taken!', type: 'error' });
      return;
    }
  
    // Check if username field is empty
    if (username === '') {
      setNotification({
        message: 'Please enter a Username',
        type: 'error'
      });
      return;
    }
  
    try {
      const dataToSend = {
        ...formData,
        username,
        registerSecret: "thisisgonnabetheextralayerofsecurity"
      };
  
      baseHelper.addToLocalStorage('formData', dataToSend);
  
      // Show notification
      setNotification({ message: 'Username available', type: 'success' });
  
      // Navigate after a delay
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/signup', { state: { formData: dataToSend } });
      }, 1000); // Adjust the delay as needed
  
    } catch (error) {
      setLoading(false);
      console.error('Sign up error:', error);
      setNotification({
        message: error.response?.data?.message || 'Sign up failed!',
        type: 'error'
      });
    }
  };
  
  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter h-[100vh]">
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
      <div className="flex justify-between">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className=" z-20 transition-all">
          <ConnectButton />
        </div>
      </div>
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[35rem] mt-10 m-auto">
        <div className="mb-14">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white text-center">
            Pick a Username for Web3mail
          </h2>
          <p className="text-sm text-white font-thin text-center">
            Choose your unique username for Web3mail.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div
                className={`flex justify-center items-center p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white ${
                  usernameAvailability === 'Taken'
                    ? 'border-2 border-red-500'
                    : usernameAvailability === 'Available'
                    ? 'border-2 border-green-500'
                    : ''
                }`}
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                  required
                />
                <p className="text-gray-200">@web3mail.club</p>
              </div>
              {usernameAvailability && (
                <div className={`text-end ${usernameAvailability === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                  {usernameAvailability === 'Available' ? 'Available' : 'Not Available'}
                </div>
              )}
              {suggestions.length > 0 && (
                <div ref={suggestionsRef} className="mt-2 text-white">
                  <p className="text-sm">Suggestions:</p>
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => setUsername(suggestion)} className="cursor-pointer hover:text-gray-400">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-10 items-center justify-between">
            <button
              className='text-lg font-semibold text-white bg-blue-500 rounded-xl transition-all px-8 py-3 w-full'
              onClick={handleSubmit}
              disabled={loading}
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

export default PickUsername;
