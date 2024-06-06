import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    emailUser: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const suggestionsRef = useRef(null);

  const takenUsernames = ['user1', 'user2', 'user3', 'Rohan', 'Aniket', 'Louis', 'Kartiket'];

  const adminEmail = import.meta.env.REACT_APP_ADMIN_EMAIL;
  const adminPassword = import.meta.env.REACT_APP_ADMIN_PASSWORD;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setUsernameSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'username') {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = (username) => {
    const isTaken = takenUsernames.includes(username);
    setUsernameAvailability(isTaken ? 'Taken' : 'Available');
    if (isTaken) {
      suggestUsernames(username);
    } else {
      setUsernameSuggestions([]);
    }
  };

  const suggestUsernames = (baseUsername) => {
    const suggestions = [];
    while (suggestions.length < 3) {
      const randomNumber = Math.floor(Math.random() * 1000);
      const suggestion = `${baseUsername}${randomNumber}`;
      if (!takenUsernames.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    }
    setUsernameSuggestions(suggestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Passwords do not match!', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const email = `${formData.emailUser}@web3mail.club`;
      const dataToSend = {
        username: formData.username,
        email: email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      console.log('Sending data to first API:', dataToSend);

      // First API call
      const response1 = await axios.post('http://16.16.74.176:8000/api/v1/register/', dataToSend);

      console.log('Response from first API:', response1.data);

      if (response1.data.success) {
        const payload2 = {
          email: email,
          password: formData.password,
        };

        console.log('Sending data to second API:', payload2);

        // Second API call
        const response2 = await axios.post('https://box.web3mail.club/admin/mail/users/add', payload2, {
          auth: {
            username: adminEmail,
            password: adminPassword
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        console.log('Response from second API:', response2.data);

        setLoading(false);
        if (response2.data.success) {
          setNotification({ message: 'Signup successful!', type: 'success' });
        } else {
          setNotification({ message: 'Signup failed on the second API!', type: 'error' });
        }
      } else {
        setLoading(false);
        setNotification({ message: 'Signup failed on the first API!', type: 'error' });
      }
    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
      setNotification({ message: 'Signup failed!', type: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="flex items-center justify-center bg-[#050122] lg:py-40 py-20 px-2 relative inter">
      <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0" />
      <img src={bg2} alt="" className="lg:block absolute hidden bottom-0 left-0" />
      <div className="bg-[#0c072c] lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[35rem] border-[0.1px] border-[#453995]">
        <div className="mb-14">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white">Sign up for Web3mail</h2>
          <p className="text-sm text-white font-thin">Glad to have you on board! Create your email account with Web3mail now.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="emailUser"
                placeholder="Email"
                value={formData.emailUser}
                onChange={handleChange}
                className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
                required
                aria-autocomplete="list"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 top-8 p-2 text-white focus:outline-none"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 top-8 p-2 text-white focus:outline-none"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                // onChange={handleChange}
                onInput={handleChange}
                className="w-full p-4 outline-[#3c77fb] py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
                required
              />
              {usernameAvailability && (
                <span className={`absolute inset-y-0 right-3 top-3 p-2 text-white ${usernameAvailability === 'Taken' ? 'text-red-500' : 'text-[#3EE92F]'}`}>
                  {usernameAvailability}
                </span>
              )}
            </div>
            {usernameSuggestions.length > 0 && (
              <div ref={suggestionsRef} className="mt-2 text-[#808080] bg-[#161134] p-3 rounded-lg">
                <ul className='flex flex-col gap-4'>
                  {usernameSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, username: suggestion });
                        setUsernameSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-8 mb-6">
            <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" required />
            <label className="text-sm font-medium text-gray-200">
              I agree to the <span className="underline cursor-pointer">Terms and Conditions</span> and
              <span className="underline ml-1 cursor-pointer">Privacy Policy</span>.
            </label>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="p-2 px-8 bg-blue-500 float-end text-white rounded-full text-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="loader"></div>
            ) : (
              'Next'
            )}
          </motion.button>
        </form>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={handleCloseNotification}
          />
        )}
      </div>
    </div>
  );
};

export default SignupForm;
