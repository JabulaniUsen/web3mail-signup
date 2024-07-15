import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../config/axios';
import { useNavigate } from 'react-router-dom';
import baseHelper from '../utils/helper';
import Notification from './Notification';

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
  
      setLoading(true);
      console.log(usernameAvailability);
      setTimeout(() => {
        setLoading(false);
        if (usernameAvailability === 'Available') {
          navigate('/signup', { state: { formData: dataToSend } });
        } else {
          setNotification({ message: 'Invalid name. Try another one', type: 'error' });
        }
      }, 1000); 
    } catch (error) {
      setLoading(false);
      console.error('Omor error:', error);
      if (usernameAvailability === 'Available') {
        navigate('/signup', { state: { formData: dataToSend } });
      } else {
        setNotification({ message: 'Invalid name. Try another one', type: 'error' });
      }
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
        setUsernameAvailability('Username must be greater than 4 characters');
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

  const handleCloseNotification = () => {
    setNotification(null);
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

      </div>
      {loading && <div className="loader"></div>}
      {notification && <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />}
    </div>
  );
};

export default EmailChecker;
