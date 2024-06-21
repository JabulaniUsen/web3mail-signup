import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [emailAvailability, setEmailAvailability] = useState(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setEmailAvailability(null);
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

    if (name === 'email') {
      checkEmailAvailability(value);
    }
  };

  // const checkEmailAvailability = async (email) => {
  //   try {
  //     const response = await axios.post('http://16.16.74.176:8000/api/v1/isEmailTaken', { email });
  //     setEmailAvailability(response.data.isTaken ? 'Taken' : 'Available');
  //   } catch (error) {
  //     console.error('Email check error:', error);
  //     setEmailAvailability(null);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Passwords do not match!', type: 'error' });
      return;
    }
  
    setLoading(true);
  
    try {
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        email: `${formData.email}@web3mail.club`,
        password: formData.password,
      };
  
      console.log('Sending data to API:', dataToSend);
  
      // API call
      const response = await axios.post('http://16.16.74.176:8000/api/v1/register', dataToSend);
  
      console.log('Response from API:', response.data);
  
      setLoading(false);
      if (response.data.success) {
        setNotification({ message: response.data.message, type: 'success' });
        navigate('/create-mail', { state: { username: dataToSend.email } }); // Navigate to CreateMail with username
      } else {
        setNotification({ message: response.data.message, type: 'error' });
      }
    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
      setNotification({ message: error.response?.data?.message || 'Signup failed!', type: 'error' });
    }
  };
  

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="flex items-center justify-center bg-[#050122] lg:py-40 py-20 px-2 relative inter">
      <button className='absolute top-10 right-10 z-20 p-2 px-8 bg-blue-500 float-end text-white rounded-full hover:bg-blue-800 transition-all text-lg'>
        Connect Wallet
      </button>
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
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4">
              <label className="text-white">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Male
              </label>
              <label className="text-white">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Female
              </label>
              <label className="text-white">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Other
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className={`flex justify-center items-center p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white ${emailAvailability === 'Taken' ? 'border-2 border-red-500' : emailAvailability === 'Available' ? 'border-2 border-green-500' : ''
                    }`}>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full outline-none bg-transparent'
                  required
                />
                <p className='text-gray-200'>@web3mail.club</p>
              </div>
              {emailAvailability && (
                <div ref={suggestionsRef} className="absolute left-0 mt-2 w-full p-2 rounded-lg bg-[#050122] border-[0.1px] border-[#453995] z-10">
                  <div className={`p-2 text-sm rounded-lg ${emailAvailability === 'Taken' ? 'text-red-500' : 'text-green-500'}`}>
                    {emailAvailability === 'Taken' ? (
                      <>
                        <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                        Email is already taken. Please choose another one.
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Email is available.
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-500" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-500" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 lg:py-5 mt-6 text-lg font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-800 transition-all"
            disabled={loading}
          >
            {loading ? <div className="loader"></div> : 'Next'}
          </button>
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

export default SignupForm;
