import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import axiosInstance from '../config/axios';
import Notification from '../Components/Notification';
import baseHelper from '../utils/helper';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';

const PickUsername = () => {
  const { isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
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
      if (!username) {
        return;
      }
      // Check for special characters, spaces, or uppercase letters
      const specialCharPattern = /[^a-zA-Z0-9]/;
      const uppercasePattern = /[A-Z]/;
      if (specialCharPattern.test(username)) {
        setUsernameAvailability('Invalid Username');
        return;
      }
      if (uppercasePattern.test(username)) {
        setUsernameAvailability('Username should not contain uppercase letters');
        return;
      }
      if (username.length < 3) {
        setUsernameAvailability('Username must be greater than 3 characters');
        return;
      }
      const response = await axiosInstance.get(`/emailAvailability/${username}`);
      const { success, available } = response.data;
      if (!success) {
        throw new Error("Failed to check email availability");
      }
      setUsernameAvailability(available ? 'Available' : 'Not Available');
      setSuggestions([]);
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameAvailability(null);
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for special characters, spaces, or uppercase letters
    const specialCharPattern = /[^a-zA-Z0-9]/;
    const uppercasePattern = /[A-Z]/;
    if (specialCharPattern.test(username)) {
      setNotification({
        message: 'Username should not contain special characters or spaces!',
        type: 'error'
      });
      return;
    }
    if (uppercasePattern.test(username)) {
      setNotification({
        message: 'Username should not contain uppercase letters!',
        type: 'error'
      });
      return;
    }
    if (usernameAvailability !== 'Available') {
      setNotification({ message: 'Username is already taken!', type: 'error' });
      return;
    }
    if (username === '') {
      setNotification({
        message: 'Please enter a Username',
        type: 'error'
      });
      return;
    }
    
    const email = username;

    try {
      const dataToSend = {
        ...formData,
        email,
        registerSecret: "thisisgonnabetheextralayerofsecurity"
      };
      
      baseHelper.addToLocalStorage('formData', dataToSend);
      
      // Navigate after a delay
      if (!isConnected) {
        setNotification({
          message: 'Please connect wallet first',
          type: 'error'
        });
      } else {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate('/signup', { state: { formData: dataToSend } });
        }, 1000);
      }
      
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
                className={`flex justify-center items-center p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white ${usernameAvailability !== 'Available'
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
                  {usernameAvailability}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-10 items-center justify-between">
            <button
              className={` ${usernameAvailability === 'Available' & isConnected ? 'opacity-100' : 'opacity-50 '} text-lg font-semibold text-white bg-blue-500 rounded-xl transition-all px-8 py-3 w-full`}
              onClick={handleSubmit}
              disabled={loading || usernameAvailability != 'Available'}
            >
              {loading ? <div className="loader"></div> : 'Next'}
            </button>
          </div>
        </form>

        <a href='https://box.web3mail.club/mail/' target='_blank' className='text-gray-400 hover:text-white transition-all flex items-center justify-center mt-5'>
          Already have a web3mail? Login here.
        </a>
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
