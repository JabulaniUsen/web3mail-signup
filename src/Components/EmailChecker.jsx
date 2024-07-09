import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../config/axios';
import { useNavigate } from 'react-router-dom';
import baseHelper from '../utils/helper';

const EmailChecker = ({ onUsernameSelect, formData }) => {
  const [username, setUsername] = useState('');
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleEnterKey();
      }
    };

    const inputElement = inputRef.current;
    inputElement.addEventListener('keydown', handleKeyDown);
    return () => {
      inputElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [username]);

  const handleChange = (e) => {
    const { value } = e.target;
    setUsername(value);
    onUsernameSelect(value);
  };

  const handleEnterKey = () => {
    const email = username;
    try {
      const dataToSend = {
        ...formData,
        email,
        registerSecret: "thisisgonnabetheextralayerofsecurity"
      };

      baseHelper.addToLocalStorage('formData', dataToSend);

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

  const checkUsernameAvailability = async (username) => {
    try {
      if (!username) return;

      const specialCharPattern = /[^a-zA-Z0-9]/;
      if (specialCharPattern.test(username)) {
        setUsernameAvailability('Invalid Username');
        return;
      }
      if (username.length < 3) {
        setUsernameAvailability('Username must be greater than 3 characters');
        return;
      }
      const response = await axiosInstance.get(`/emailAvailability/${username}`);
      const { success, available } = response.data;
      if (!success) throw new Error("Failed to check email availability");

      setUsernameAvailability(available ? 'Available' : 'Not Available');
      setSuggestions(available ? [] : generateSuggestions(username));
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

  return (
    <div>
      <div className="relative">
        <div className={`flex justify-center items-center p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white ${usernameAvailability !== 'Available'
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
            ref={inputRef}
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

        {suggestions.length > 0 && (
          <div ref={suggestionsRef} className="mt-2 text-white p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134]">
            <ul className='flex flex-col gap-4'>
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => { setUsername(suggestion); onUsernameSelect(suggestion); }} className="cursor-pointer hover:text-gray-400">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {loading && <div className="loader"></div>}
      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}
    </div>
  );
};

export default EmailChecker;
