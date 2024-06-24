import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; 
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axiosInstance from '../config/axios';
import Button from '../Components/Button';
import { useAccount } from 'wagmi';

const SignIn = () => {
  const { isConnected } = useAccount();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const dataToSend = {
        email: `${formData.email}@web3mail.club`,
        password: formData.password
      };

      console.log('Sending data to API:', dataToSend); // TODO: implement API call
    } catch (error) {
      setLoading(false);
      console.error('Sign in error:', error);
      setNotification({
        message: error.response?.data?.message || 'Sign in failed!',
        type: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="flex items-center justify-center bg-[#050122] lg:py-40 py-20 px-2 relative inter">
      <div className="absolute top-10 right-10 z-20 float-end transition-all">
        <ConnectButton />
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
      <div className="bg-[#0c072c] lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[35rem] border-[0.1px] border-[#453995]">
        <div className="mb-14">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white text-center">
            Sign in to Web3mail
          </h2>
          <p className="text-sm text-white font-thin text-center">
            Sign in to your account to send and receive emails.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium my-2 mt-6 text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div
                className={`flex justify-center items-center p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white`}
              >
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                  required
                />
                <p className="text-gray-200">@web3mail.club</p>
              </div>
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
          {/* <button
            type="submit"
            className="w-full py-3 lg:py-5 mt-6 text-lg font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-800 transition-all"
            disabled={loading}
          >
            {loading ? <div className="loader"></div> : 'Next'}
          </button> */}
          <Button walletConnected={isConnected}>
            {loading ? <div className="loader"></div> : 'Next'}
          </Button>
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

export default SignIn;
