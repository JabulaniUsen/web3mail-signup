import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Passwords do not match!', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;

      const response = await axios.post('http://localhost:8000/api/v1/register', dataToSend);

      setLoading(false);
      if (response.data.success) {
        setNotification({ message: 'Signup successful!', type: 'success' });
      } else {
        setNotification({ message: 'Signup failed!', type: 'error' });
      }
    } catch (error) {
      setLoading(false);
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium my-2 mt-6 text-white">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full p-4 outline-none py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium my-2 mt-6 text-white">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full p-4 outline-none py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4 w-full p-4 outline-none py-3 lg:py-5 rounded-xl bg-[#161134] text-white ">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                Female
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                Other
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 outline-none py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
              required
            />
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
              className="w-full p-4 outline-none py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
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
              className="w-full p-4 outline-none py-3 lg:py-5 rounded-xl bg-[#161134] text-white"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="w-4 h-4"
            />
            <label htmlFor="terms" className="text-sm text-[#808080]">
              I agree to the <span className="text-[#3C77FB] cursor-pointer">Terms of Service</span> and <span className="text-[#3C77FB] cursor-pointer">Privacy Policy</span>.
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
              'Sign up'
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
