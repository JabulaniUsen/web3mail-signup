import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import logo from '../assets/logo.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Button from '../Components/Button';

const SignUp = () => {
  const { isConnected } = useAccount();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Passwords do not match!', type: 'error' });
      return;
    }

    navigate('/create-mail', { state: { formData } });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="lg:px-20 px-5  bg-[#050122] lg:pb-40 py-20 relative inter">
      <div className="flex justify-between mb-20">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className=" z-20 transition-all">
          <ConnectButton />
        </div>
      </div>

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
      <div className="bg-[#0c072c] m-auto lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[35rem] border-[0.1px] border-[#453995] mt-10">
        <div className="mb-14">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white text-center">
            Sign up for Web3mail
          </h2>
          <p className="text-sm text-white font-thin text-center">
            Glad to have you on board! Create your email account with Web3mail
            now.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-gray-500"
                />
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
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-gray-500"
                />
              </div>
            </div>
          </div>
          <div className="">
            <Button walletConnected={isConnected} onClick={handleSubmit}>
              {loading ? <div className="loader"></div> : 'Next'}
            </Button>
            
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

export default SignUp;
